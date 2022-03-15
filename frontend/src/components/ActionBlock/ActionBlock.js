import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import { useState } from 'react';
import ServiceSelector from 'components/ServiceSelector';
import dataMatch from 'dataMatch';
import { Data } from 'components';
import { Typography } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';

import './ActionBlock.scss'

function ActionBlock(props)
{
    const { title, services, isReaction, onChange, label, defaultValue } = props

    const [selected, setSelected] = useState({service: defaultValue?.service, action: defaultValue?.action, data: defaultValue?.action?.data});
    const [actions, setActions] = useState([]);

    const [inputDatas, setInputDatas] = useState([]);
    const [inputCollapse, setInputCollapse] = useState(false)

    
    // On Selected Service Value Changed
    React.useEffect(() => {
        (async () => {
            if (!selected.service)
            return;
            
            if (isReaction)
            setActions(selected.service.reactions)
            else {
                setActions(selected.service.actions)
            }
          })();

    }, [selected.service])

    // On Selected Action Value Changed
    React.useEffect(() => {
        setInputDatas([])

        if (!selected.action)
            return;

        let data = dataMatch[selected.service.name][isReaction ? "reactions" : "actions"][selected.action.name];
        if (!data) {
            return;
        }
    
        let datas = []
        // Add information about the data
        Object.keys(data).forEach((key) => {
            const param = data[key];
            param.name = key;
            datas.push(param);
        })
        setInputDatas(datas)
    }, [selected.action])

    React.useEffect(() => {
        if (onChange)
            onChange(selected)
    }, [selected])


    function onServiceSelect(selectedService)
    {
        setSelected({
            ...selected,
            service: selectedService,
            action: undefined
        })
    }

    function onActionSelect(selectedAction)
    {
        console.log(selectedAction)
        setSelected({
            ...selected,
            action: selectedAction ? {
                ...selectedAction,
                service: selected.service.name,
            } : undefined
        })
    }

    const onReactionDataChange = (data) => {
        let temp = {
            ...selected.data
        }
        temp[data.name] = data.value

        setSelected({
            ...selected,
            data: temp
        })
      }
    
    return (
      <div className='main-background'>
        <div className='main-container'>
            <div className="block-title-container">
                <div className="block-title">
                    {title}
                </div>
            </div>
            
            {/* Selector Service */}
            <ServiceSelector
                items={services}
                label="Choose a service"
                onChange={onServiceSelect}
                defaultValue={selected.service}
                className='service-field'
                classNameTextField='service-text-field'
            />

            {/* Selector Action */}
            { selected.service && actions.length > 0 ?
                <ServiceSelector
                    items={actions}
                    label={label}
                    onChange={onActionSelect}
                    defaultValue={selected.action}
                    className='action-field'
                    classNameTextField='action-text-field'
                /> : null
            }
            { inputDatas.length > 0 &&
                <div className={'data-container'}>
                    <ToggleButton
                        selected={inputCollapse}
                        onClick={() => setInputCollapse(!inputCollapse) }
                        className='input-toggle-button'
                    >
                        { inputCollapse ? <ExpandLessRoundedIcon style={{ marginRight: '10px' }} /> : <ExpandMoreRoundedIcon /> }
                        Input Fields
                    </ToggleButton>

                    {/* List all the data and show the corresponding component */}
                    <Collapse in={inputCollapse}>
                        { inputDatas.map((value) => {
                                return (
                                    <Data data={value} onChange={onReactionDataChange} defaultValue={selected.data ? selected.data[value.name] : undefined} />
                                )
                            })
                        }
                    </Collapse>
                </div>
            }
        </div>
      </div>
    )
}

export default ActionBlock