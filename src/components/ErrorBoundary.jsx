import { Component } from "react";
import Button from "./Button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty">
          <p className="kicker">Something went wrong</p>
          <h1>The page didn’t finish plating.</h1>
          <Button to="/">Back Home</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
