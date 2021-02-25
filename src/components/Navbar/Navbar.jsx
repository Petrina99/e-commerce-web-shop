import React from "react";

import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";

import Logo from "../../assets/Untitled.jpg";

import useStyles from "./styles";

function Navbar({ totalItems }){
    const classes = useStyles();
    const location = useLocation();

    return(
        <div>
            <AppBar position="fixed" className={classes.AppBar} color="inherit">
                <Toolbar>
                    <Typography component={Link} to="/" variant="h6" className={classes.title} color="inherit">
                        <img src={Logo} alt="Web Shop" height="25px" className={classes.image} />
                        Petrinos Web Shop
                    </Typography>
                    <div className={classes.grow} />
                    {location.pathname === "/" ? (
                    <div className={classes.button}>
                        <IconButton component={Link} to="/cart" aria-label="Show cart items" color="inherit">
                            <Badge badgeContent={totalItems} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </div>) : ""}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar;