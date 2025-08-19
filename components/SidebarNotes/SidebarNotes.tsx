import css from './SidebarNotes.module.css';
import Link from 'next/link';

type tagsProps = {
  tags: string[];
};

const SidebarNotes = ({ tags }: tagsProps) => {
  return (
    <nav aria-label="Notes navigation">
      <Link href="/notes/filter/all" className={css.menuLinkAll}>
        All notes
      </Link>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNotes;