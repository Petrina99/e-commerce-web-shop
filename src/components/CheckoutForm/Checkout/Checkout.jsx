import React, { useState, useEffect } from 'react';

import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

import { commerce } from "../../../lib/commerce";

import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";

const steps = ["Shipping address", "Payment details"];

function Checkout({ cart, order, onCaptureCheckout, error, handleEmptyCart }){

    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingdata] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const history = useHistory();

    const classes = useStyles();

    useEffect(() => {
        const generateToken = async () => {
            try{
                const response = await commerce.checkout.generateToken(cart.id, { type: "cart" });

                setCheckoutToken(response);
            }
            catch (error){
                console.log(error);
            }
        }

        generateToken();
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep+1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep-1);

    const next = (data) => {
        setShippingdata(data);

        nextStep();
    }

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true);
        }, 3000)
    }

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5">
                    Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}
                </Typography>
                <Divider className={classes.divider}/>
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
        </>
    ) : isFinished ? 
            <div>
                <Typography variant="h5">
                    Thank you for your purchase!
                </Typography>
                <Divider className={classes.divider}/>
                <br />
                <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
            </div> : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error)
    {
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
        </>
    }

    const Form = () => activeStep === 0 ?
     <AddressForm checkoutToken={checkoutToken} next={next} /> 
     : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} handleEmptyCart={handleEmptyCart}/>;

    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    { activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
