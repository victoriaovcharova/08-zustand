import css from "./LayoutNotes.module.css"

type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

const NoteLayout = ({ children, sidebar }: Props) => {
  return (
    <div className={css.container}>
      <section className={css.sidebar}>{sidebar}</section>
      <section className={css.notesWrapper}>{children}</section>
    </div>
  );
};

export default NoteLayout;