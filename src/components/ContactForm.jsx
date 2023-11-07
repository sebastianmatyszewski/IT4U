import React, {useState} from 'react';
import classes from "./ContactForm.module.css"
import Checkbox from './Checkbox';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Pole imię i nazwisko jest wymagane'),
  phone: Yup.string()
    .matches(/^\d{9}$/, 'Numer telefonu musi składać się z 9 cyfr'),
  email: Yup.string()
    .email('Wprowadź prawidłowy adres e-mail')
    .required('Pole Email jest wymagane'),
});

function ContactForm() {
  const [submitCount, setSubmitCount] = useState(1);
  return (
    <Formik
      initialValues={{
        name: '',
        phone: '',
        email: '',
        agreement_mail: false,
        agreement_call: false,
        agreement_sms: false,
        error_test: 'sebastianmatyszewski@gmail.com'
      }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        if (!(values.agreement_mail || values.agreement_call || values.agreement_sms)) {
          actions.setFieldError('agreement_mail', 'Musisz zaznaczyć przynajmniej jedną zgodę');
          actions.setFieldError('agreement_call', 'Musisz zaznaczyć przynajmniej jedną zgodę');
          actions.setFieldError('agreement_sms', 'Musisz zaznaczyć przynajmniej jedną zgodę');
        } else {
          if (submitCount % 10 === 0) {
            values.error_test = '';
          } else {
            values.error_test = values.email;
          }
          const emailField = document.getElementById('email');

          const emailErr = document.getElementById('seccessContent');
          if (emailErr) {
            emailErr.parentNode.removeChild(emailErr);
          }

          if (emailField) {
            const existingErrorDivs = emailField.parentNode.querySelectorAll('.text-danger');
            existingErrorDivs.forEach(div => div.remove());
          }

          axios.postForm('https://test8.it4u.company/sapi/modules/contact/form/40042ce28394dc369948c018b22c534d', values)
            .then(response => {
              if (response.data && response.data.result == "OK") {
                const phoneField = document.getElementById('phone');
                const contentDiv = document.createElement('div');
                contentDiv.className = 'd-flex flex-column align-items-center';
                contentDiv.id = 'seccessContent';
                contentDiv.innerHTML = response.data.content;
                if (phoneField) {
                  phoneField.parentNode.appendChild(contentDiv);
                }
              } else if(response.data && response.data.result == "INVALID"){
                if (emailField) {
                  if (response.data.error && Object.keys(response.data.error).length > 0) {
                    const firstErrorKey = Object.keys(response.data.error)[0];
                    const errorMessage = response.data.error[firstErrorKey];
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-danger';
                    errorDiv.innerHTML = errorMessage;
                    emailField.parentNode.appendChild(errorDiv);
                  }
                }
              }
            })
            .catch(error => {
              console.error('Błąd:', error);
            })
            .finally(() => {
              setSubmitCount(submitCount + 1);
            });
        }
      }}
    >
      {({ touched, errors, values }) => (
        <Form className={classes.form}>
          <Field type="hidden" name="error_test" />
        <div>
          <Field type="text" id="name" placeholder="Imię i nazwisko" name="name" />
          <ErrorMessage name="name" component="div" className="text-danger"/>
        </div>

        <div>
          <Field type="text" id="phone" placeholder=" Telefon" name="phone" />
          <ErrorMessage name="phone" component="div" className="text-danger"/>
        </div>

        <div>
          <Field type="email" id="email" placeholder="Email" name="email" />
          <ErrorMessage name="email" component="div" className="text-danger"/>
        </div>
        <div className={classes.agreeCommercialInfo} >
					Wyrażam zgodę na otrzymywanie od Duda Development Sp. z o.o. SKA
					z siedzibą w Poznaniu ul. Macieja Palacza 144, 60-278 Poznań, informacji handlowej:
				</div>
        {values.email && !errors.email && (
          <Checkbox name="agreement_mail" label="W formie elektronicznej (mail) na wskazany adres mailowy" />
        )}
        {values.phone && !errors.phone && (
          <>
            <Checkbox name="agreement_call" label="Drogą telefoniczną, na udostępniony numer telefonu" />
            <Checkbox name="agreement_sms" label="W formie sms, na udostępniony numer telefonu" />
          </>
        )}
        
        {((touched.agreement_mail && errors.agreement_mail) || (touched.agreement_call && errors.agreement_call) || (touched.agreement_sms && errors.agreement_sms)) && (
          <div className='text-danger'>{errors.agreement_mail}</div>
        )}

        <Button className={classes.submitButton} type="submit">Wyślij</Button>
        
        <div className="w-100 pt-2 d-flex justify-content-center">
          <a className={classes.dataAdmin}>Kto będzie administratorem Twoich danych osobowych?</a>
        </div>
      </Form>
      )}
    </Formik>
  )
};

export default ContactForm;