import { ReactNode } from 'react';
import './Note.scss';

interface NoteProps {
    children: ReactNode;
}

const Note = ({ children }: NoteProps) => (
    <div className="stachesepl-note">
        {children}
    </div>
);

export default Note;
