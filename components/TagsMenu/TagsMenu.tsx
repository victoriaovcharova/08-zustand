'use client';

import { useState } from 'react';
import Link from 'next/link';
import css from './TagsMenu.module.css';

const DEFAULT_TAGS = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;
type Tag = (typeof DEFAULT_TAGS)[number];

type Props = {
  /** Если не передать — возьмём DEFAULT_TAGS */
  tags?: readonly Tag[];
};

export default function TagsMenu({ tags = DEFAULT_TAGS }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={() => setIsOpen((s) => !s)}>
        {isOpen ? 'Notes ▴' : 'Notes ▾'}
      </button>

      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li className={css.menuItem} key={tag}>
              <Link
                href={`/notes/filter/${encodeURIComponent(tag)}`}
                className={css.menuLink}
                onClick={() => setIsOpen(false)}
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
