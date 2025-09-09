"use client";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CARD_REGISTRY, LayoutItem } from "@/lib/dashboard/cards";

function SortableCard({
  item, editing, onHide, renderCard,
}: {
  item: LayoutItem;
  editing: boolean;
  onHide: (id: LayoutItem["id"]) => void;
  renderCard: (id: LayoutItem["id"]) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const def = CARD_REGISTRY.find((c) => c.id === item.id);
  const span = def?.span ?? "col-span-4";

  return (
    <div ref={setNodeRef} style={style} className={`${span} h-full`}>
      <div className="relative h-full">
        {editing && (
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button 
              className="px-2 py-1 text-xs rounded-lg bg-[#2A2A33] text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors" 
              {...attributes} 
              {...listeners}
              data-testid={`drag-${item.id}`}
            >
              ↕ Drag
            </button>
            <button 
              className="px-2 py-1 text-xs rounded-lg bg-[#2A2A33] text-rose-400 hover:bg-rose-400/20 transition-colors" 
              onClick={() => onHide(item.id)}
              data-testid={`hide-${item.id}`}
            >
              ✕ Hide
            </button>
          </div>
        )}
        {renderCard(item.id)}
      </div>
    </div>
  );
}

export function SortableGrid({
  items, onReorder, editing, onHide, renderCard,
}: {
  items: LayoutItem[];
  onReorder: (from: number, to: number) => void;
  editing: boolean;
  onHide: (id: LayoutItem["id"]) => void;
  renderCard: (id: LayoutItem["id"]) => React.ReactNode;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const from = items.findIndex((i) => i.id === active.id);
        const to = items.findIndex((i) => i.id === over.id);
        onReorder(from, to);
      }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-12 gap-3 auto-rows-[1fr] items-stretch">
          {items.map((it) => (
            <SortableCard 
              key={it.id} 
              item={it} 
              editing={editing} 
              onHide={onHide} 
              renderCard={renderCard} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}