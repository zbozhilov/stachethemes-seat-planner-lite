import { __ } from '@src/utils';
import { Keyboard, AutoAwesome } from '@mui/icons-material';
import './Content.scss';

type LineProps = {
    keystroke: string,
    description: string
}

const Line = (props: LineProps) => {

    return (

        <div className='stachesepl-workflow-info-dialog-content-line'>
            <div className='stachesepl-workflow-info-dialog-content-line-keystroke'>
                {props.keystroke}
            </div>
            <div className='stachesepl-workflow-info-dialog-content-line-description'>
                {props.description}
            </div>
        </div>

    )

}

const Content = () => {

    const lines: LineProps[] = [
        {
            keystroke: 'Ctrl / Cmd + Z',
            description: __('UNDO')
        },
        {
            keystroke: 'Ctrl / Cmd + Y',
            description: __('REDO')
        },
        {
            keystroke: 'Ctrl / Cmd + A',
            description: __('SELECT_ALL_OBJECTS')
        },
        {
            keystroke: 'Ctrl / Cmd + I',
            description: __('INVERT_SELECTION')
        },
        {
            keystroke: 'Ctrl / Cmd + C',
            description: __('COPY_SELECTED_OBJECTS')
        },
        {
            keystroke: 'Ctrl / Cmd + V',
            description: __('PASTE_SELECTED_OBJECTS')
        },
        {
            keystroke: 'Del',
            description: __('DELETE_SELECTED_OBJECTS')
        },
        {
            keystroke: 'Esc',
            description: __('DESELECT_ALL_OBJECTS')
        },
        {
            keystroke: 'G',
            description: __('TOGGLE_GRID')
        },
        {
            keystroke: 'H',
            description: __('GRID_CONTRAST')
        },
        {
            keystroke: 'C',
            description: __('GRID_COLOR')
        },
        {
            keystroke: '[',
            description: __('DECREASE_GRID_SIZE')
        },
        {
            keystroke: ']',
            description: __('INCREASE_GRID_SIZE')
        },
        {
            keystroke: 'L',
            description: __('TOGGLE_EDITOR_SEAT_TEXT_DISPLAY__LABEL_PRICE_SEAT_ID')
        }
    ];

    const autoIncrementPatterns = [
        {
            title: __('LINEAR_INCREMENT_PATTERN'),
            description: __('INCREMENTS_SEQUENTIALLY_THROUGH_VALUES'),
            examples: [
                { pattern: '[1]!', result: '1, 2, 3…', explanation: __('NUMBERS_INCREMENT_BY_ONE') },
                { pattern: '[A]!', result: 'A, B, C…', explanation: __('LETTERS_INCREMENT_ALPHABETICALLY') },
                { pattern: '[A*3]!', result: 'A, A, A, B, B, B, …', explanation: __('REPEAT_EACH_LETTER_3_TIMES') },
                { pattern: '[1*3]!', result: '1, 1, 1, 2, 2, 2, …', explanation: __('REPEAT_EACH_NUMBER_3_TIMES') }
            ]
        },
        {
            title: __('CYCLIC_INCREMENT_PATTERN'),
            description: __('CYCLES_THROUGH_LIMITED_RANGE_THEN_REPEATS'),
            examples: [
                { pattern: '[A~3]!', result: 'A, B, C, A, B, C, …', explanation: __('CYCLE_A_TO_C_THEN_REPEAT') },
                { pattern: '[1~3]!', result: '1, 2, 3, 1, 2, 3, …', explanation: __('CYCLE_1_TO_3_THEN_REPEAT') }
            ]
        },
        {
            title: __('COMBINED_PATTERNS'),
            description: __('COMBINE_MULTIPLE_PATTERNS_WITH_SEPARATORS'),
            examples: [
                { pattern: '[A*3]-[1~3]!', result: 'A-1, A-2, A-3, B-1, B-2, B-3, …', explanation: __('REPEAT_LETTERS_WITH_CYCLING_NUMBERS') }
            ]
        }
    ];

    return (
        <div className='stachesepl-workflow-info-dialog-content'>
            <div className='stachesepl-workflow-info-dialog-content-section'>
                <h3 className='stachesepl-workflow-info-dialog-content-section-title'>
                    <Keyboard />
                    {__('KEYBOARD_SHORTCUTS')}
                </h3>
                {
                    lines.map(line => <Line key={line.keystroke} keystroke={line.keystroke} description={line.description} />)
                }
            </div>

            <div className='stachesepl-workflow-info-dialog-content-section'>
                <h3 className='stachesepl-workflow-info-dialog-content-section-title'>
                    <AutoAwesome />
                    {__('AUTO_INCREMENT_PATTERNS')}
                </h3>
                {autoIncrementPatterns.map((section, sectionIndex) => (
                    <div key={sectionIndex} className='stachesepl-workflow-info-dialog-content-pattern-section'>
                        <h4 className='stachesepl-workflow-info-dialog-content-pattern-title'>
                            {section.title}
                        </h4>
                        <div className='stachesepl-workflow-info-dialog-content-pattern-description'>
                            {section.description}
                        </div>
                        {section.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className='stachesepl-workflow-info-dialog-content-pattern-example'>
                                <div className='stachesepl-workflow-info-dialog-content-pattern-code'>
                                    {example.pattern}
                                </div>
                                <div className='stachesepl-workflow-info-dialog-content-pattern-arrow'>
                                    →
                                </div>
                                <div className='stachesepl-workflow-info-dialog-content-pattern-result'>
                                    {example.result}
                                </div>
                                <div className='stachesepl-workflow-info-dialog-content-pattern-explanation'>
                                    {example.explanation}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Content