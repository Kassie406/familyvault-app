import { Router } from "express";
import { nanoid } from "nanoid";

const router = Router();

// In-memory storage for demo purposes
const activeMeetings = new Map();

// Get active family meeting status
router.get("/meeting/status", async (req, res) => {
  try {
    // TODO: Add proper authentication and family ID from session
    const familyId = "family-1";
    
    // Find active meeting for this family
    const activeMeeting = Array.from(activeMeetings.values()).find(
      (meeting: any) => meeting.familyId === familyId && meeting.status === 'active'
    );

    res.json({
      activeMeeting: activeMeeting || null,
      familyId
    });
  } catch (error) {
    console.error("Error getting meeting status:", error);
    res.status(500).json({ error: "Failed to get meeting status" });
  }
});

// Create new family meeting
router.post("/meeting/create", async (req, res) => {
  try {
    // TODO: Add proper authentication and get user from session
    const userId = "current-user";
    const familyId = "family-1";
    const { title, type } = req.body;

    // End any existing active meetings for this family
    Array.from(activeMeetings.entries()).forEach(([id, meeting]) => {
      if ((meeting as any).familyId === familyId && (meeting as any).status === 'active') {
        (meeting as any).status = 'ended';
        (meeting as any).endedAt = new Date().toISOString();
      }
    });

    const meetingId = nanoid();
    const meeting = {
      id: meetingId,
      title: title || "Family Group Meeting",
      type: type || "group_chat",
      familyId,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      status: 'active',
      participants: [],
      shareableLink: `${req.protocol}://${req.get('host')}/family/meeting/${meetingId}?join=true`
    };

    activeMeetings.set(meetingId, meeting);

    console.log(`[family-meetings] Created new meeting ${meetingId} for family ${familyId}`);
    res.json(meeting);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

// Get specific meeting details
router.get("/meeting/:meetingId", async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = activeMeetings.get(meetingId);

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // TODO: Verify user has access to this family meeting
    res.json(meeting);
  } catch (error) {
    console.error("Error getting meeting details:", error);
    res.status(500).json({ error: "Failed to get meeting details" });
  }
});

// Join meeting
router.post("/meeting/:meetingId/join", async (req, res) => {
  try {
    const { meetingId } = req.params;
    // TODO: Get user from session
    const userId = "current-user";
    const userName = "Current User";

    const meeting = activeMeetings.get(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    if (meeting.status !== 'active') {
      return res.status(400).json({ error: "Meeting is not active" });
    }

    // Add participant if not already in meeting
    const existingParticipant = meeting.participants.find((p: any) => p.id === userId);
    if (!existingParticipant) {
      meeting.participants.push({
        id: userId,
        name: userName,
        joinedAt: new Date().toISOString(),
        status: 'connected'
      });
    } else {
      existingParticipant.status = 'connected';
    }

    console.log(`[family-meetings] User ${userId} joined meeting ${meetingId}`);
    res.json({ success: true, meeting });
  } catch (error) {
    console.error("Error joining meeting:", error);
    res.status(500).json({ error: "Failed to join meeting" });
  }
});

// Leave meeting
router.post("/meeting/:meetingId/leave", async (req, res) => {
  try {
    const { meetingId } = req.params;
    // TODO: Get user from session
    const userId = "current-user";

    const meeting = activeMeetings.get(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Update participant status
    const participant = meeting.participants.find((p: any) => p.id === userId);
    if (participant) {
      participant.status = 'disconnected';
      participant.leftAt = new Date().toISOString();
    }

    console.log(`[family-meetings] User ${userId} left meeting ${meetingId}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Error leaving meeting:", error);
    res.status(500).json({ error: "Failed to leave meeting" });
  }
});

// End meeting (only creator or admin)
router.post("/meeting/:meetingId/end", async (req, res) => {
  try {
    const { meetingId } = req.params;
    // TODO: Get user from session and verify permissions
    const userId = "current-user";

    const meeting = activeMeetings.get(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // TODO: Check if user is meeting creator or family admin
    meeting.status = 'ended';
    meeting.endedAt = new Date().toISOString();
    meeting.endedBy = userId;

    console.log(`[family-meetings] Meeting ${meetingId} ended by ${userId}`);
    res.json({ success: true, meeting });
  } catch (error) {
    console.error("Error ending meeting:", error);
    res.status(500).json({ error: "Failed to end meeting" });
  }
});

export default router;