import { tools } from '../../tools'
import ToolItem from '../ToolItem/ToolItem'
import './ToolItems.scss'

const ToolItems = () => {

    return (
        <div className='stachesepl-toolbar-items'>
            {
                tools.map(tool => {
                    return (
                        <ToolItem key={tool.id} {...tool} />
                    )
                })
            }
        </div>
    )
}

export default ToolItems