import "./style.css"; // Assuming you are using CSS for styling
import Toolbar from "./Toolbar";
import ShapeList from "./ShapeList";
import StatusBar from "./StatusBar";
import RightView from "./RightView";

function App() {
  return (
    <div class="app-container">
      <div class="leftView">
        <Toolbar />
        <ShapeList />
        <StatusBar />
      </div>
      <div class="rightOutView">
        <RightView />
      </div>
    </div>
  );
}

export default App;
