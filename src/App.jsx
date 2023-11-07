
import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import ContactForm from './components/ContactForm';

function App() {
    return (
        <div className={classes.backgroundImage}>
			<div className={classes.mainContent}>
				<div className=''>
					<p className={classes.contactText}>Czy już widzisz tutaj swój nowy dom? Skontaktuj się z nami</p>
					<p className={`${classes.contactText} ${classes.fontWeightBold} fw-bold mt-2 mb-5`}>i porozmawiajmy o ofercie na działki!</p>
				</div>
				<ContactForm className={classes.formWrapper} />
			</div>
        </div>
    );
}

export default App;
