import React from 'react';
import {Navbar, Nav, NavDropdown, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";

function NavBar(){
    let basketCount = useSelector((store)=>store.basketReducer.count);
    
    return(
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky={"top"}>
                <Navbar.Brand href="/">HAF</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link to="/">
                            <button>Home</button>
                        </Link>
                        <Link to="/product">
                            <button>product</button>
                        </Link>
                        <Link to="/customer">
                            <button>customer</button>
                        </Link>
                        <Link to="/board">
                            <button>board</button>
                        </Link>
                        <Link to="/order">
                            <button>order</button>
                        </Link>
                        <Link to="/product/upload">
                            <Button variant="outline-primary">upload</Button>
                        </Link>
                    {/*    <NavDropdown title="Shopping" id="collasible-nav-dropdown">*/}
                    {/*        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Divider />*/}
                    {/*        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                    {/*    </NavDropdown>*/}

                    {/*    <NavDropdown title="Brand" id="collasible-nav-dropdown">*/}
                    {/*        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Divider />*/}
                    {/*        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                    {/*    </NavDropdown>*/}

                    {/*    <NavDropdown title="고민별 케어" id="collasible-nav-dropdown">*/}
                    {/*        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                    {/*        <NavDropdown.Divider />*/}
                    {/*        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                    {/*    </NavDropdown>*/}
                    </Nav>
                    <Nav>
                        <Link to="/customer/login">Login</Link>
                        <Link to="/order/basket">Cart</Link> <span style={{color:"red", backgroundColor:"#FFF"}}>{ basketCount }</span>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    );
}

export default NavBar;