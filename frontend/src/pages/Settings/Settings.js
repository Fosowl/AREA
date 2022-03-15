import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from "axios";

import Selector from 'components/Selector';
import Header from 'components/Header';
import Service from 'components/Service';

import api from 'api/Api';
import {Account} from 'api/Account';
import './Settings.scss'
import { colors } from '@mui/material';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({ 

    ServiceTxt: {
      marginTop: '10px',
      textDecorationLine: 'underline',
      fontWeight: '800',
      color: '#111',
      fontFamily: 'Droid serif',
      fontSize: '36px',
      textAlign: 'center'
    },

    BottomAdder: {
      marginTop: '30px',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    },
    
    ServiceSelect: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },

    OkButton: {
      backgroundColor: 'black',
      color: 'white',
      fontSize: '20px',
      padding: '15px',
      margin: '30px',
      borderRadius: '5px',
      cursor: 'pointer'
    },
});

let account = undefined;

function Settings() {
  // TOFIX: get account from last page
  const classes = useStyles();

  const [ServicesDict, setServicesDict] = useState({});
  const [ServicesUsers, setServicesUsers] = useState({});
  const [ServicesDictUsers, setServicesDictUsers] = useState([]);
  const [ServicesNames, setServicesNames] = useState([]);
  const [UsersDone, setUsersDone] = useState(false);
  const [DictDone, setDictDone] = useState(false);
  const [SelectorShow, setSelectorShow] = useState(false);
  const [ProceedDictUsers, setProceedDictUsers] = useState(false);
  const [RequestAddService, setRequestAddService] = useState(false);
  const [Selection, setSelection] = useState("");

  const [account, setAccount] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token)
    {
        // redirect to login page
        navigate('/login')
        return
    }
    else
    {
      setAccount(new Account(token))
    }
  }, [])

  // Fill servicesNames and servicesDict
  useEffect(() => {
    if (!DictDone && account !== undefined) {
      axios.get("https://area-api-server.herokuapp.com/api/services", {
        headers: {
          'Content-Type': "application/json"
        }
      }).then((res) => {
        setServicesDict(res["data"].data);
        setDictDone(true);
      })
    } else if (account !== undefined){
      let tmp = []
      ServicesDict.map((ser) => {
        tmp.push(ser.pretty_name);
      })
      setServicesNames(tmp);
    } else {
      console.log("user acccount undefined !");
    }
  }, [DictDone, account])
    
  // Fill ServicesUsers
  useEffect(() => {
    if (!UsersDone && account !== undefined) {
      axios.get("https://area-api-server.herokuapp.com/api/services/available", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': account.id 
        }
      }).then((res) => {
        setServicesUsers(res["data"].data);
        setUsersDone(true);
      });
    } else if (account !== undefined){
      setProceedDictUsers(true);
    }
  }, [UsersDone, account])
    
  // fill ServicesDictUsers
  useEffect(() => {
    let tmp = [];
    if (Array.isArray(ServicesDict) && Array.isArray(ServicesUsers)) {
       ServicesDict.map((ser) => (
        ServicesUsers.map(function(name) {
          if (name == ser.pretty_name.toLowerCase()) {
            tmp.push(ser);
          }
        })
      ))
      setServicesDictUsers(tmp);
    }
  }, [ProceedDictUsers])

  function linkService() {
    if (account !== undefined) {
      account.link_account_with(Selection.toLowerCase());
    } 
  }
  
  function addServiceBtn() {
    if (SelectorShow) {
      setSelectorShow(false);
    } else {
      setSelectorShow(true);
    }
  }

  function setValue(val) {
    setSelection(val);
  }

  return (
    <div>
      <Header page="settings"/>
      <p className={classes.ServiceTxt}>
          Services :
      </p>
      <div>
        <ul>
          { ServicesDictUsers.map((ser) => (
            <Service key={ser.pretty_name} name={ser.pretty_name} description={ser.description} />
          ))}
        </ul>
      </div>
      <div className={classes.BottomAdder}>
        {!SelectorShow && (
        <Button onClick={addServiceBtn}>
          <AddCircleOutlineIcon style={{fontSize: 64, color: 'error'}}/>
        </Button>)}
        {SelectorShow && (
          <div className={classes.ServiceSelect}>
            <Selector Listed={ServicesNames} current='Select service...'
            stateChanger={setValue}/>
            <button className={classes.OkButton}
                    onClick={linkService}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings;
