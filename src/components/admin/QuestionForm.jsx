import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

function makeDefaultChoices() {
  return [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ];
}

function buildState(question) {
  if (!question) return { text: '', points: 1, choices: makeDefaultChoices() };
  return {
    text: question.text ?? '',
    points: question.points ?? 1,
    choices: question.choices?.length
      ? question.choices.map((c) => ({ text: c.text, isCorrect: c.isCorrect }))
      : makeDefaultChoices(),
  };
}

export function QuestionForm({ question, onSubmit, onCancel, loading }) {
  const [state, setState] = useState(() => buildState(question));
  const [errors, setErrors] = useState({});

  function setCorrect(index) {
    setState((prev) => ({
      ...prev,
      choices: prev.choices.map((c, i) => ({ ...c, isCorrect: i === index })),
    }));
  }

  function updateChoiceText(index, value) {
    setState((prev) => ({
      ...prev,
      choices: prev.choices.map((c, i) => (i === index ? { ...c, text: value } : c)),
    }));
  }

  function addChoice() {
    if (state.choices.length >= 6) return;
    setState((prev) => ({
      ...prev,
      choices: [...prev.choices, { text: '', isCorrect: false }],
    }));
  }

  function removeChoice(index) {
    if (state.choices.length <= 2) return;
    const wasCorrect = state.choices[index].isCorrect;
    const nextChoices = state.choices.filter((_, i) => i !== index);
    if (wasCorrect && nextChoices.length > 0) nextChoices[0].isCorrect = true;
    setState((prev) => ({ ...prev, choices: nextChoices }));
  }

  function validate() {
    const next = {};
    if (!state.text.trim()) next.text = 'Énoncé requis.';
    if (!state.points || state.points < 0.5) next.points = 'Nombre de points invalide.';
    const filledChoices = state.choices.filter((c) => c.text.trim());
    if (filledChoices.length < 2) next.choices = 'Au moins 2 choix avec du texte.';
    if (state.choices.length > 6) next.choices = 'Maximum 6 choix.';
    const correctCount = state.choices.filter((c) => c.isCorrect).length;
    if (correctCount !== 1) next.correct = 'Exactement un choix doit être correct.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      text: state.text.trim(),
      points: Number(state.points),
      choices: state.choices.map((c) => ({ text: c.text.trim(), isCorrect: c.isCorrect })),
    };
    onSubmit(payload);
  }

  const canAddChoice = state.choices.length < 6;
  const canRemoveChoice = state.choices.length > 2;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="q-text" className="mb-1.5 block text-sm font-medium text-gray-700">Énoncé</label>
        <textarea
          id="q-text"
          rows={3}
          placeholder="Quel langage est principalement exécuté sur la JVM ?"
          value={state.text}
          onChange={(e) => { setState((prev) => ({ ...prev, text: e.target.value })); if (errors.text) setErrors((prev) => ({ ...prev, text: undefined })); }}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
            errors.text ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-400 focus:ring-indigo-100'
          }`}
        />
        {errors.text && <p className="mt-1 text-xs text-red-500">{errors.text}</p>}
      </div>

      <Input
        id="q-points"
        label="Points"
        type="number"
        min="0.5"
        step="0.5"
        value={state.points}
        onChange={(e) => { setState((prev) => ({ ...prev, points: e.target.value })); if (errors.points) setErrors((prev) => ({ ...prev, points: undefined })); }}
        error={errors.points}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Choix</label>
        <div className="flex flex-col gap-2">
          {state.choices.map((choice, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct-choice"
                checked={choice.isCorrect}
                onChange={() => setCorrect(i)}
                className="h-4 w-4 shrink-0 text-indigo-600 focus:ring-indigo-500"
                aria-label={`Choix ${i + 1} — correct`}
              />
              <input
                type="text"
                value={choice.text}
                onChange={(e) => updateChoiceText(i, e.target.value)}
                placeholder={`Choix ${i + 1}`}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {choice.isCorrect && (
                <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">Correct</span>
              )}
              <button
                type="button"
                onClick={() => removeChoice(i)}
                disabled={!canRemoveChoice}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none disabled:opacity-30"
                aria-label={`Supprimer le choix ${i + 1}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        {errors.choices && <p className="mt-1 text-xs text-red-500">{errors.choices}</p>}
        {errors.correct && <p className="mt-1 text-xs text-red-500">{errors.correct}</p>}
        <button
          type="button"
          onClick={addChoice}
          disabled={!canAddChoice}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <Plus size={14} /> Ajouter un choix
        </button>
        {!canAddChoice && (
          <p className="mt-1 text-xs text-gray-400">Maximum de 6 choix atteint.</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-1">
        <Button variant="ghost" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="violet" loading={loading} className="bg-gradient-to-r from-violet-600 to-indigo-600">
          {question ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
