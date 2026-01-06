'use client';

import type { Ereignis } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { EventEditor } from './EventEditor';

interface EventEditorModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Event to edit (null for new event) */
  ereignis?: Ereignis | null;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Modal wrapper for EventEditor component
 */
export function EventEditorModal({
  isOpen,
  ereignis,
  onClose,
}: EventEditorModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ereignis ? 'Ereignis bearbeiten' : 'Neues Ereignis'}
    >
      <EventEditor
        ereignis={ereignis}
        onSave={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
