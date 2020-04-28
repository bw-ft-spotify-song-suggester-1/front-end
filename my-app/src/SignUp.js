import React, {useState, useEffect} from 'react';
import * as yup from 'yup'
import axios from 'axios'
import './SignUp.css'

const formSchema = yup.object().shape({
    username: yup
    .string()
    .required("Username is required."),
    password: yup
    .string()
    .required("Password input is required")
    .min(4, "Requires at least 4 characters"),
})



const SignUp = (props) => {
    const [formState, setFormState] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        password: "",
    });

    const [user, setUser] = useState([]);

    const [buttonDisabled, setButtonDisabled] = useState(true);


    useEffect(() => {
        formSchema.isValid(formState)
        .then(valid => {
            setButtonDisabled(!valid);
        })
    },[formState])




    const handleSubmit = event => {
        event.preventDefault();
        axios
            .post("https://reqres.in/api/users", formState)
            .then(res => {
                setUser([...user, res.data]);
                console.log("success", user)

            setFormState({
                username:"", 
                password:"",
            });
        })
        .catch(err => console.log(err.response))
    }

    const validateChange = event => {
        yup
            .reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then(valid =>{
                setErrors({
                    ...errors,
                    [event.target.name]: ""
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [event.target.name]: err.errors[0]
                });
            });
    };
    const onInputChange = event => {
        event.persist();
        const newFormData= {
            ...formState,
            [event.target.name]:
                event.target.type === "checkbox" ? event.target.checked
                    : event.target.value
        }
        validateChange(event);
        setFormState(newFormData)

      };
    //   console.log(errors)


    return (
        <div className='login-page'>
        <div className='whole-container'>
        <form className='team-form' onSubmit={handleSubmit}>
            <div className="inputs-container">
            <div className="head">
            <h2>sign up</h2>
            </div>
            <div className='inputs'>
            <label>
            <input placeholder="username" className="user-input" type="text" value={formState.name} onChange={onInputChange} name='username'/>
            </label>
            <label>
            <input placeholder="password" className="pass-input" type="password" value={formState.password} onChange={onInputChange} name='password'/>
            </label>
            <div className='errors'>
            {errors.username.length > 0 ? (<p className='errors'>{errors.username}</p>) : null}
            </div>
            <div className='errors'>
            {errors.password.length > 0 ? (<p className='errors'>{errors.password}</p>) : null}
            </div>
            <button data-cy='submit' className='submit' disabled={buttonDisabled}>let's go</button>
            </div>
            </div>
        </form>
        </div>
        {/* <div className='returnedArray'>
        <pre id='text'>{JSON.stringify(user, null, 2)}</pre>
        </div> */}
        </div>
    )
}

export default SignUp