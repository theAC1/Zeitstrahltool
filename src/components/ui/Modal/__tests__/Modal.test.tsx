import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal, ModalFooter } from '../Modal';

describe('Modal', () => {
  beforeEach(() => {
    // Create modal root if it doesn't exist
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.setAttribute('id', 'modal-root');
      document.body.appendChild(modalRoot);
    }
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = '';
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should render with title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('should render with description', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Test"
        description="This is a test modal"
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByText('This is a test modal')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Schließen');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked by default', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );

    const overlay = screen.getByRole('presentation').querySelector('.bg-black\\/50');
    if (overlay) {
      fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not close when overlay is clicked if closeOnOverlayClick is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
        <p>Content</p>
      </Modal>
    );

    const overlay = screen.getByRole('presentation').querySelector('.bg-black\\/50');
    if (overlay) {
      fireEvent.click(overlay);
      expect(handleClose).not.toHaveBeenCalled();
    }
  });

  it('should lock body scroll when open', async () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  it('should unlock body scroll when closed', async () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });

    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
    });
  });

  it('should support different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        <p>Content</p>
      </Modal>
    );

    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-sm');

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="md">
        <p>Content</p>
      </Modal>
    );
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-md');

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        <p>Content</p>
      </Modal>
    );
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-lg');

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="xl">
        <p>Content</p>
      </Modal>
    );
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-xl');

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="full">
        <p>Content</p>
      </Modal>
    );
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-4xl');
  });

  it('should apply custom className', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} className="custom-modal">
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-modal');
  });

  it('should render children', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <button>Action Button</button>
        <p>Some text</p>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    expect(screen.getByText('Some text')).toBeInTheDocument();
  });

  it('should not close on Escape when isOpen is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={false} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should have close button with X icon', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Schließen');
    const svg = closeButton.querySelector('svg');

    expect(closeButton).toBeInTheDocument();
    expect(svg).toBeInTheDocument();
  });
});

describe('ModalFooter', () => {
  it('should render children', () => {
    render(
      <ModalFooter>
        <button>Cancel</button>
        <button>OK</button>
      </ModalFooter>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <ModalFooter className="custom-footer">
        <button>OK</button>
      </ModalFooter>
    );

    const footer = screen.getByText('OK').parentElement;
    expect(footer).toHaveClass('custom-footer');
  });

  it('should have default footer styles', () => {
    render(
      <ModalFooter>
        <button>OK</button>
      </ModalFooter>
    );

    const footer = screen.getByText('OK').parentElement;
    expect(footer).toHaveClass('mt-6');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('justify-end');
  });
});
