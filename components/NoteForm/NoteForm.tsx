'use client';
import css from './NoteForm.module.css';
import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import type { NewNote } from '@/types/note';

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const NoteForm = () => {
  const router = useRouter();
  const id = useId();

  const handleClickCancel = () => router.push('/notes/filter/all');

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const { mutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData) as unknown as NewNote;
    // const data: NewNote = {
    //   title: formData.get('title') as string,
    //   content: formData.get('content') as string,
    //   tag: formData.get('tag') as NewNote['tag'],
    // };
    // console.log('form data', data);

    mutate(data);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${id}-title`}>Title</label>
        <input
          id={`${id}-title`}
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft?.title}
          onChange={handleChange}
        />
        {/* <span name="title" className={css.error} /> */}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-content`}>Content </label>
        <textarea
          id={`${id}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleChange}
        />

        {/* <span name="content" className={css.error} /> */}
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${id}-tag`}>Tag</label>
        {
          <select
            id={`${id}-tag`}
            name="tag"
            className={css.select}
            defaultValue={draft?.tag}
            onChange={handleChange}
          >
            {tags.map((tag) => (
              <option value={tag} key={tag}>
                {tag}
              </option>
            ))}
          </select>
        }
        {/* <span name="tag" className={css.error} /> */}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleClickCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;