import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import Header from 'components/Header';
import IsLoadingHOC from 'components/IsLoadingHOC';

import api from 'api/Api';
import { Account } from 'api/Account';
import { Layout } from 'Theme'
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Link } from 'Tools'
import { toast } from 'react-toastify';

import './Home.scss'

let account = undefined;

function Home(props)
{
  const [Widgets, setWidgets] = useState([]);
  const { isLoading, setIsLoading } = props;
  const [account, setAccount] = useState(undefined);

  // This var is use to remove the transition delay when the 'enter animation' end
  const [isEnd, setIsEnd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token)
    {
      navigate('/login')
    }
    else
    {
      setAccount(new Account(token));
    }
  }, []);

  useEffect(() => {
    if (!account)
      return;
    api.widget.get_all(account.id)
      .then((widgets) => {
          setWidgets(widgets);
          setIsLoading(false);
      })
  }, [account]);


  const onRemoveWidget = (widget) => {
    // TODO: Remove widget for the server
    // TODO: Notify the user when the widget is removed

    widget.delete().then(() => {
      toast.success("Widget deleted")
      let arr = Widgets.filter((item) => {
        return item.id !== widget.id
      })
      console.log(arr)
      setWidgets(arr)
    })
  }

  return (
    <div className={"home-page"}>
      <Header page="dashboard"/>

      { !isLoading &&
        <div className='widget-container'>
          <TransitionGroup className='widget-container'>
          { Widgets.map((widget, index) => {
              let btnClass = {
                'transition-delay': `${300 * (index + 1)}ms`
              };

              return (
                <CSSTransition
                  key={index}
                  appear={true}
                  timeout={2000}
                  classNames="fade"
                  onEntered={(node, isAppearing) => setIsEnd(isAppearing) }
                  style={isEnd ? undefined : btnClass}
                >
                  <div className='widget'>
                    <Button className='widget-button' onClick={() => navigate("/widget/update/" + widget.id, { CurrentState: widget })}>
                      <div className={"icon-container"}>
                          <div className={"background-icon"}>
                            <img src={Link[widget.action.service]} className={"icon"} />
                          </div>
                          <div className={"background-icon"}>
                            <img src={Link[widget.reaction.service]} className={"icon"} />
                          </div>
                      </div>
                      <p className={"widget-name"} >My {widget.action.service} to {widget.reaction.service} widget</p>
                    </Button>

                    <Button className={"remove-button"} onClick={() => onRemoveWidget(widget)}>
                        <DeleteForeverRoundedIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Button>

                    <ArrowForwardIosRoundedIcon sx={{ fontSize: 40, color: 'white' }} className='widget-arrow' />
                  </div>
                </CSSTransition>
              );
            })
          }
          </TransitionGroup>

          <CSSTransition
            appear={true}
            in={true}
            timeout={2000}
            classNames="fadeUp"
            style={{ 'transition-delay': !isEnd ? '1.5s' : '0s' }}
          >
            <div className={"add-button-container"}>
              <Button onClick={() => navigate("/widget/add")} className='add-button' style={Layout.fullSize}>
                <AddRoundedIcon sx={{ fontSize: 60, color: 'white' }}/>
              </Button>
            </div>
          </CSSTransition>
        </div>
      }
    </div>
  )
}

export default IsLoadingHOC(Home);