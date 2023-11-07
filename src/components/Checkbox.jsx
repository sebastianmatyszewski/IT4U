import React from 'react';
import classes from './Checkbox.module.css';
import { Field } from 'formik';

const Checkbox = ({ name, label }) => (
  <div className='d-flex flex-row gap-2 checkbox'>
    <label className={`${classes.container}`} >
      {label}
      <Field type="checkbox" name={name} />
      <span className={classes.checkmark}></span>
    </label>
  </div>
);

export default Checkbox;