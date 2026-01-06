'use client';

import type { Epoche } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { EpochEditor } from './EpochEditor';

interface EpochEditorModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Epoch to edit (null for new epoch) */
  epoche?: Epoche | null;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Modal wrapper for EpochEditor component
 */
export function EpochEditorModal({
  isOpen,
  epoche,
  onClose,
}: EpochEditorModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={epoche ? 'Epoche bearbeiten' : 'Neue Epoche'}
    >
      <EpochEditor
        epoche={epoche}
        onSave={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}
