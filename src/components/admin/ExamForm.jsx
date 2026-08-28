import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { courseService } from '../../api/courseService';


function toDatetimeLocal(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(val) {
  if (!val) return null;
  return new Date(val).toISOString();
}

export function ExamForm({ initial, onSubmit, onCancel, loading }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: initial?.courseId ?? '',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    startDate: initial ? toDatetimeLocal(initial.startDate) : '',
    endDate: initial ? toDatetimeLocal(initial.endDate) : '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    courseService.getCourses()
      .then((data) => { if (Array.isArray(data)) setCourses(data); })
      .catch(() => setCourses([]));
  }, []);

  function validate() {
    const next = {};
    if (!form.courseId) next.courseId = 'Sélectionnez un cours.';
    if (!form.title.trim()) next.title = 'Titre requis.';
    if (!form.startDate) next.startDate = 'Date de début requise.';
    if (!form.endDate) next.endDate = 'Date de fin requise.';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      next.endDate = 'La date de fin doit être après la date de début.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      courseId: form.courseId,
      startDate: fromDatetimeLocal(form.startDate),
      endDate: fromDatetimeLocal(form.endDate),
    };
    if (form.description.trim()) payload.description = form.description.trim();
    onSubmit(payload);
  }

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="exam-course" className="mb-1.5 block text-sm font-medium text-gray-700">Cours</label>
        <select
          id="exam-course"
          value={form.courseId}
          onChange={(e) => set('courseId', e.target.value)}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-navy transition-colors focus:outline-none focus:ring-2 ${
            errors.courseId ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-primary-400 focus:ring-primary-100'
          }`}
        >
          <option value="">— Sélectionner un cours —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
          ))}
        </select>
        {errors.courseId && <p className="mt-1 text-xs text-red-500">{errors.courseId}</p>}
      </div>

      <Input
        id="exam-title"
        label="Titre"
        placeholder="Examen final Java"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        error={errors.title}
        autoFocus
      />

      <Textarea
        id="exam-description"
        label="Description"
        rows={3}
        placeholder="Évaluation des notions de Java..."
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
      />

      <Input
        id="exam-startDate"
        label="Date de début"
        type="datetime-local"
        value={form.startDate}
        onChange={(e) => set('startDate', e.target.value)}
        error={errors.startDate}
      />

      <Input
        id="exam-endDate"
        label="Date de fin"
        type="datetime-local"
        value={form.endDate}
        onChange={(e) => set('endDate', e.target.value)}
        error={errors.endDate}
      />

      <div className="flex justify-end gap-3 mt-1">
        <Button variant="ghost" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="violet" loading={loading} className="bg-gradient-to-r from-primary-600 to-primary-700">
          {initial ? 'Enregistrer' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
