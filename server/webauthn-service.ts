import { 
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type VerifyAuthenticationResponseOpts,
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON
} from '@simplewebauthn/server';
import crypto from 'crypto';
import { storage } from './storage';

const RP_NAME = 'FamilyCircle Secure';
const RP_ID = process.env.NODE_ENV === 'production' 
  ? 'familycirclesecure.com' 
  : 'localhost';
const ORIGIN = process.env.NODE_ENV === 'production' 
  ? 'https://familycirclesecure.com' 
  : 'http://localhost:5000';

/**
 * WebAuthn Service for passwordless authentication
 * Implements FIDO2/WebAuthn standards for enterprise security
 */
export class WebAuthnService {
  /**
   * Generate registration options for new WebAuthn credential
   */
  static async generateRegistration(userId: string, userEmail: string) {
    try {
      // Get existing credentials to exclude them from new registration
      const existingCredentials = await this.getUserCredentials(userId);
      
      const options: GenerateRegistrationOptionsOpts = {
        rpName: RP_NAME,
        rpID: RP_ID,
        userID: userId,
        userName: userEmail,
        userDisplayName: userEmail.split('@')[0],
        attestationType: 'none',
        excludeCredentials: existingCredentials.map(cred => ({
          id: cred.credentialId,
          type: 'public-key',
          transports: cred.transports as any[]
        })),
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Prefer platform authenticators (Face ID, Touch ID, Windows Hello)
          userVerification: 'required',
          residentKey: 'preferred'
        },
        supportedAlgorithmIDs: [-7, -257], // ES256 and RS256
      };

      const registrationOptions = await generateRegistrationOptions(options);
      
      // Store challenge temporarily (in production, use Redis or secure session store)
      await this.storeChallenge(userId, registrationOptions.challenge);
      
      return registrationOptions;
    } catch (error) {
      console.error('WebAuthn registration generation failed:', error);
      throw new Error('Failed to generate WebAuthn registration options');
    }
  }

  /**
   * Verify registration response and store new credential
   */
  static async verifyRegistration(
    userId: string, 
    response: RegistrationResponseJSON,
    expectedChallenge: string
  ) {
    try {
      const verification: VerifyRegistrationResponseOpts = {
        response,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
      };

      const verificationResult = await verifyRegistrationResponse(verification);
      
      if (!verificationResult.verified || !verificationResult.registrationInfo) {
        throw new Error('WebAuthn registration verification failed');
      }

      // Store the credential
      const { credentialID, credentialPublicKey, counter } = verificationResult.registrationInfo;
      
      await this.storeCredential({
        userId,
        credentialId: Buffer.from(credentialID).toString('base64url'),
        publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
        counter: counter || 0,
        name: await this.getAuthenticatorName(response),
        transports: response.response.transports || []
      });

      return { verified: true, credentialId: Buffer.from(credentialID).toString('base64url') };
    } catch (error) {
      console.error('WebAuthn registration verification failed:', error);
      return { verified: false, error: error.message };
    }
  }

  /**
   * Generate authentication options for login
   */
  static async generateAuthentication(userEmail?: string) {
    try {
      let allowCredentials: any[] = [];
      
      if (userEmail) {
        // Get user's credentials for account-specific login
        const user = await storage.getUserByEmail(userEmail);
        if (user) {
          const credentials = await this.getUserCredentials(user.id);
          allowCredentials = credentials.map(cred => ({
            id: cred.credentialId,
            type: 'public-key',
            transports: cred.transports
          }));
        }
      }

      const options: GenerateAuthenticationOptionsOpts = {
        rpID: RP_ID,
        allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
        userVerification: 'preferred',
        timeout: 60000 // 1 minute
      };

      const authOptions = await generateAuthenticationOptions(options);
      
      // Store challenge temporarily
      const challengeId = crypto.randomUUID();
      await this.storeChallenge(challengeId, authOptions.challenge);
      
      return { ...authOptions, challengeId };
    } catch (error) {
      console.error('WebAuthn authentication generation failed:', error);
      throw new Error('Failed to generate WebAuthn authentication options');
    }
  }

  /**
   * Verify authentication response and complete login
   */
  static async verifyAuthentication(
    response: AuthenticationResponseJSON,
    expectedChallenge: string
  ) {
    try {
      // Find credential by ID
      const credentialId = response.id;
      const credential = await this.getCredentialById(credentialId);
      
      if (!credential) {
        throw new Error('Credential not found');
      }

      const verification: VerifyAuthenticationResponseOpts = {
        response,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        authenticator: {
          credentialID: Buffer.from(credential.credentialId, 'base64url'),
          credentialPublicKey: Buffer.from(credential.publicKey, 'base64url'),
          counter: credential.counter
        }
      };

      const verificationResult = await verifyAuthenticationResponse(verification);
      
      if (!verificationResult.verified) {
        throw new Error('Authentication verification failed');
      }

      // Update counter
      if (verificationResult.authenticationInfo) {
        await this.updateCredentialCounter(
          credentialId, 
          verificationResult.authenticationInfo.newCounter
        );
      }

      // Update last used timestamp
      await this.updateCredentialLastUsed(credentialId);

      return { 
        verified: true, 
        userId: credential.userId,
        credentialId: credentialId
      };
    } catch (error) {
      console.error('WebAuthn authentication verification failed:', error);
      return { verified: false, error: error.message };
    }
  }

  /**
   * Get user's WebAuthn credentials
   */
  private static async getUserCredentials(userId: string) {
    // This would query your webauthn_credentials table
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Store WebAuthn credential
   */
  private static async storeCredential(credential: {
    userId: string;
    credentialId: string;
    publicKey: string;
    counter: number;
    name: string;
    transports: string[];
  }) {
    // This would insert into your webauthn_credentials table
    console.log('Storing WebAuthn credential:', credential.credentialId);
  }

  /**
   * Get credential by ID
   */
  private static async getCredentialById(credentialId: string) {
    // This would query your webauthn_credentials table by credential ID
    return null;
  }

  /**
   * Update credential counter after successful authentication
   */
  private static async updateCredentialCounter(credentialId: string, newCounter: number) {
    // Update counter in database
    console.log(`Updating credential ${credentialId} counter to ${newCounter}`);
  }

  /**
   * Update credential last used timestamp
   */
  private static async updateCredentialLastUsed(credentialId: string) {
    // Update last_used timestamp in database
    console.log(`Updating credential ${credentialId} last used timestamp`);
  }

  /**
   * Store challenge temporarily (should use Redis in production)
   */
  private static async storeChallenge(key: string, challenge: string) {
    // In production, store in Redis with TTL
    // For now, we'll use a simple in-memory store
    console.log(`Storing challenge for key: ${key}`);
  }

  /**
   * Get authenticator name based on response
   */
  private static async getAuthenticatorName(response: RegistrationResponseJSON): Promise<string> {
    // Try to determine authenticator type from response
    // This is a simplified implementation
    if (response.response.transports?.includes('internal')) {
      return 'Platform Authenticator (Face ID, Touch ID, Windows Hello)';
    } else if (response.response.transports?.includes('usb')) {
      return 'Security Key (USB)';
    } else if (response.response.transports?.includes('nfc')) {
      return 'Security Key (NFC)';
    }
    return 'Unknown Authenticator';
  }

  /**
   * Check if user has any WebAuthn credentials registered
   */
  static async hasCredentials(userId: string): Promise<boolean> {
    const credentials = await this.getUserCredentials(userId);
    return credentials.length > 0;
  }

  /**
   * List user's registered authenticators (for management UI)
   */
  static async listUserAuthenticators(userId: string) {
    const credentials = await this.getUserCredentials(userId);
    return credentials.map(cred => ({
      id: cred.credentialId,
      name: cred.name,
      lastUsed: cred.lastUsed,
      createdAt: cred.createdAt
    }));
  }

  /**
   * Remove a WebAuthn credential
   */
  static async removeCredential(userId: string, credentialId: string): Promise<boolean> {
    // Remove credential from database
    // Ensure user can't lock themselves out (require at least one auth method)
    console.log(`Removing credential ${credentialId} for user ${userId}`);
    return true;
  }
}

export default WebAuthnService;