'use client';

import { useState } from 'react';
import Link from 'next/link';
import css from './TagsMenu.module.css';

const DEFAULT_TAGS = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

type Props = {
  /** Если не передадим — возьмём дефолтные */
  tags?: readonly string[];
};

export default function TagsMenu({ tags = DEFAULT_TAGS }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(v => !v);
  const close = () => setIsOpen(false);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggle}>
        {isOpen ? 'Notes ▴' : 'Notes ▾'}
      </button>

      {isOpen && (
        <ul className={css.menuList}>
          {tags.map(tag => (
            <li className={css.menuItem} key={String(tag)}>
              <Link
                href={`/notes/filter/${String(tag).toLowerCase()}/1`}
                className={css.menuLink}
                onClick={close}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
