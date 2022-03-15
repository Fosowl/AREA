import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@mui/icons-material/Edit';

const useStyles = makeStyles({
    Editable: {
        margin: 10
    },

    Input: {
        background: 'transparent',
        border: 0,
        textAlign: 'center',
        fontSize: '36px',
        fontWeight: '500',
    },

    Icon: {
        position: 'relative',
        float: 'left',
    }
});

function EditableText (props) {
    const classes = useStyles();
    const { display, onInputChange } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [width, setWidth] = useState(display.length);
  
    const changeHandler = evt => {
      setWidth(evt.target.value.length);
    };

    const submitHandler = (e) => {
        onInputChange(e.target.value);
        setIsEditing(false);
        e.preventDefault();
    }

    return(
      <div className={classes.Editable}>
        <tr>
          <td>
            <EditIcon className={classes.Icon}/>
          </td>
          <td>
            { isEditing ? 
            <form onSubmit={e => { submitHandler(e); }}>
              <input type='text'
                     autoFocus
                     onChange={changeHandler} 
                     defaultValue={display}
                     className={classes.Input}
                     style={{ width: width +'ch'}}
                     maxLength = "36"
              /> 
            </form>
            : <p onDoubleClick={()=> setIsEditing(true)}
                  className={classes.Input}>{display}</p>
            }
          </td>
        </tr>
      </div>
    )
}

export default EditableText
