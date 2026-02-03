import './Section.scss';

type SectionProps = {
    children: React.ReactNode;
};

const Section = ({ children }: SectionProps) => {

    return (
        <div className='stachesepl-options-section'>
            <div className='stachesepl-options-section-content'>
                {children}
            </div>
        </div>
    )

}

export default Section;
