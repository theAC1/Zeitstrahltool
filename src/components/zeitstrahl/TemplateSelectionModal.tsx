'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Zeitstrahl } from '@/types';
import { getAllTemplates, createFromTemplate, type TemplateMetadata } from '@/lib/templates/templateService';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (zeitstrahl: Zeitstrahl) => void;
}

/**
 * Modal for selecting and creating a timeline from templates
 */
export function TemplateSelectionModal({ isOpen, onClose, onSelectTemplate }: TemplateSelectionModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('empty');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const templates = getAllTemplates();

  // Filter templates based on search query
  const filteredTemplates = searchQuery
    ? templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : templates;

  const handleCreate = useCallback(() => {
    const zeitstrahl = createFromTemplate(selectedTemplateId, customTitle || undefined);

    if (!zeitstrahl) {
      alert('Fehler beim Laden der Vorlage');
      return;
    }

    onSelectTemplate(zeitstrahl);
    onClose();

    // Reset state
    setSelectedTemplateId('empty');
    setCustomTitle('');
    setSearchQuery('');
  }, [selectedTemplateId, customTitle, onSelectTemplate, onClose]);

  const getDifficultyColor = (difficulty: TemplateMetadata['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
    }
  };

  const getDifficultyLabel = (difficulty: TemplateMetadata['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'Einfach';
      case 'intermediate':
        return 'Mittel';
      case 'advanced':
        return 'Fortgeschritten';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vorlage auswählen" size="lg">
      <div className="flex flex-col gap-6">
        {/* Search */}
        <div>
          <Input
            type="text"
            placeholder="Vorlage suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplateId(template.id)}
              className={`
                p-4 border-2 rounded-lg text-left transition-all
                hover:shadow-lg hover:border-blue-400
                ${
                  selectedTemplateId === template.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white'
                }
              `}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-2">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">{template.name}</h3>
                  <span
                    className={`
                      inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1
                      ${getDifficultyColor(template.difficulty)}
                    `}
                  >
                    {getDifficultyLabel(template.difficulty)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

              {/* Stats */}
              <div className="flex gap-4 text-xs text-gray-500 mb-2">
                <span>{template.eventCount} Ereignisse</span>
                <span>{template.epochCount} Epochen</span>
                <span>{template.categoryCount} Kategorien</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* No results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Keine Vorlagen gefunden</p>
          </div>
        )}

        {/* Custom Title Input */}
        <div>
          <label htmlFor="customTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Titel (optional)
          </label>
          <Input
            id="customTitle"
            type="text"
            placeholder={
              selectedTemplateId === 'empty'
                ? 'Mein neuer Zeitstrahl'
                : templates.find((t) => t.id === selectedTemplateId)?.name
            }
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            {selectedTemplateId === 'empty'
              ? 'Geben Sie einen Titel für Ihren neuen Zeitstrahl ein'
              : 'Optional: Überschreiben Sie den Standard-Titel der Vorlage'}
          </p>
        </div>

        {/* Selected Template Info */}
        {selectedTemplateId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-1">
              Ausgewählt: {templates.find((t) => t.id === selectedTemplateId)?.name}
            </h4>
            <p className="text-sm text-blue-700">
              {templates.find((t) => t.id === selectedTemplateId)?.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleCreate} disabled={!selectedTemplateId}>
            Zeitstrahl erstellen
          </Button>
        </div>
      </div>
    </Modal>
  );
}
