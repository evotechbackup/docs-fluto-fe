import { Nav, Container } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";
import SearchDocFaqs from "../docs/SearchDocFaqs";

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="w-100 bg-secondary-subtle">
      <Container
        fluid
        className="px-5 py-3 d-flex justify-content-between align-items-center"
      >
        <Link to="/" className="text-decoration-none">
          <h4 className="text-uppercase m-0 fw-semibold text-dark">
            Evotech Global
          </h4>
        </Link>
        <SearchDocFaqs />
        <Nav className="gap-2">
          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/"
              end
              className={`text-dark ${
                location.pathname === "/" ? "fw-bolder" : ""
              }`}
            >
              Docs
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/faqs"
              className={`text-dark ${
                location.pathname === "/faqs" ? "fw-bolder" : ""
              }`}
            >
              FAQS
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as={NavLink}
              to="/api-reference"
              className={`text-dark ${
                location.pathname === "/api-reference" ? "fw-bolder" : ""
              }`}
            >
              API Reference
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </div>
  );
};

export default Navbar;
