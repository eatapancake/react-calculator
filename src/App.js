import "./App.scss";
import React, { useEffect, useState } from "react";
import calcButtons from "./calcButtons";

//Adds Commas
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatAnswer(answer) {
  if (/[0-9.]/.test(answer) === false) {
    return answer;
  }

  const [integer, decimal] = answer.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  else {
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
  }
}

//Displays Input & Output
const Displayy = ({ input, output }) => (
  <div id="display-container">
    <div id="display-prev">{output}</div>
    <div id="display">{input}</div>
  </div>
);

//Calculator Keys Creation
const Key = ({ keyData: { id, name, type }, handleInput }) => (
  <button id={id} onClick={() => handleInput(name, type)}>
    {name}
  </button>
);
//Full Calculator Keyboard
const Keyboard = ({ handleInput }) => (
  <div className="keys calcButtons">
    {calcButtons.map((key) => (
      <Key key={key.id} keyData={key} handleInput={handleInput} />
    ))}
  </div>
);

function App() {
  //States
  const [input, setInput] = useState("0");
  const [output, setOutput] = useState("");
  const [calculatorData, setCalculatorData] = useState("");
  const [overwrite, setOverwrite] = useState(false);

  //handleDisplay
  const display = (value) => {
    if (overwrite) {
      setOverwrite(false);
      setCalculatorData(`${value}`);
      setInput(`${value}`);
      setOutput(`${value}`);
    } else if (!calculatorData.length) {
      setInput(`${value}`);
      setCalculatorData(`${value}`);
    } else {
      if (value === "0" && (calculatorData === "0" || input === "0")) {
        setCalculatorData(`${calculatorData}`);
      } else {
        const lastChar = calculatorData.charAt(calculatorData.length - 1);
        const isLastCharOperator = /[0-9.]/.test(lastChar) === false;
        setInput(isLastCharOperator ? `${value}` : `${input}${value}`);
        setCalculatorData(`${calculatorData}${value}`);
      }
    }
  };

  //AC
  const clear = () => {
    setInput("0");

    setCalculatorData("");
  };

  //+ - / *
  const handleOperators = (value) => {
    setOverwrite(false);
    if (calculatorData.length) {
      setInput(`${value}`);

      const beforeLastChar = calculatorData.charAt(calculatorData.length - 2);
      const beforeLastCharIsOperator = /[0-9.]/.test(beforeLastChar) === false;
      const lastChar = calculatorData.charAt(calculatorData.length - 1);
      const lastCharIsOperator = /[0-9.]/.test(lastChar) === false;
      const validOp = value;

      if (
        (lastCharIsOperator && value !== "-") ||
        (beforeLastCharIsOperator && lastCharIsOperator)
      ) {
        if (beforeLastCharIsOperator) {
          const updatedValue = `${calculatorData.substring(
            0,
            calculatorData.length - 2
          )}${value}`;
          setCalculatorData(updatedValue);
        } else {
          setCalculatorData(
            `${calculatorData.substring(
              0,
              calculatorData.length - 1
            )}${validOp}`
          );
        }
      } else {
        setCalculatorData(`${calculatorData}${validOp}`);
      }
    }
  };
  // =
  const handleSubmit = () => {
    // eslint-disable-next-line
    let total = eval(calculatorData);
    let total_new = total.toString();

    if (total_new.length >= 10 && total < 100) {
      total_new = total_new.substring(0, 10);

      total = parseFloat(total_new);
    }
    setInput(`${total}`);
    setOutput(`${total} = ${total}`);
    setCalculatorData(`${total}`);
    setOverwrite(true);
  };
  // .
  const dotOperator = () => {
    const lastChar = calculatorData.charAt(calculatorData.length - 1);
    if (!calculatorData.length) {
      setInput("0.");
      setCalculatorData(`0.`);
    } else {
      if (/[0-9.]/.test(lastChar) === false) {
        setInput("0.");
        setCalculatorData(`${calculatorData} 0.`);
      } else {
        setInput(
          lastChar === "." || input.includes(".") ? `${input}` : `${input}.`
        );
        const formattedValue =
          lastChar === "." || input.includes(".")
            ? `${calculatorData}`
            : `${calculatorData}.`;
        setCalculatorData(formattedValue);
      }
    }
  };

  //User Input
  const handleInput = (value, type) => {
    switch (type) {
      case "number":
        display(value, type);
        break;
      case "operation":
        handleOperators(value);
        break;
      case "clear":
        clear();
        break;
      case "period":
        dotOperator();
        break;
      case "equal":
        handleSubmit();
        break;
      default:
        break;
    }
  };

  //Output
  useEffect(() => {
    const handleOutput = () => {
      setOutput(calculatorData);
    };

    handleOutput();
  }, [calculatorData]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculator</h1>
        <div id="calc-container">
          <Displayy input={formatAnswer(input)} output={output} />
          <Keyboard handleInput={handleInput} />
        </div>
      </header>
    </div>
  );
}

export default App;
