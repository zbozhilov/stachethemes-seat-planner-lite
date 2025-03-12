import { __ } from '@src/utils';
import './Content.scss';

type LineProps = {
    keystroke: string,
    description: string
}

const Line = (props: LineProps) => {

    return (

        <div className='stsp-workflow-info-dialog-content-line'>
            <div className='stsp-workflow-info-dialog-content-line-keystroke'>
                {props.keystroke}
            </div>
            <div className='stsp-workflow-info-dialog-content-line-description'>
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


    return (
        <div className='stsp-workflow-info-dialog-content'>
            {

                lines.map(line => <Line key={line.keystroke} keystroke={line.keystroke} description={line.description} />)
            }


        </div>
    )
}

export default Content