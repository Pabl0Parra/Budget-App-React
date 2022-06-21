import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Panel from "./components/Panel";

function App() {
  const [total, setTotal] = useState(0);
  const [cost, setCost] = useState(
    // fetch all data saved in localStorage & JSON.parse to convert the string back to a JSON object
    // || if nothing on localStorage -> use the default value
    JSON.parse(localStorage.getItem("cost")) || {
      website: false,
      seo: false,
      google: false,
      pages: 1,
      languages: 1,
      total: 0,
    }
  );

  // apply useEffect to add object to localStorage whenever the value of our state changes
  useEffect(() => {
    // JSON.string... to convert JSON object to JSON text stored in a string which can be sent to the server
    window.localStorage.setItem("cost", JSON.stringify(cost));
  }, [cost]);

  const [isWebChecked, setIsWebChecked] = useState(false);

  // calculateTotal have to implement useCallback hooks since the calculation depends on cost state
  const calculateTotal = useCallback(
    (event) => {
      let newTotal =
        0 +
        (cost.website && 500) +
        (cost.seo && 300) +
        (cost.google && 200) +
        ((cost.pages > 1 || cost.languages > 1) &&
          cost.pages * cost.languages * 30);
      setTotal((prev) => (prev = newTotal));
    },
    [cost]
  );

  // Create calculation trigger, where calculateTotal will be called on any cost changes
  useEffect(() => {
    calculateTotal();
  }, [cost, calculateTotal]);

  const handleOnChange = (event) => {
    const { name } = event.target;
    const newCost = { ...cost };
    newCost[name] = !newCost[name];
    setCost((prev) => newCost);
    setIsWebChecked(newCost.website);
  };

  const eventHandler = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setCost((prevCost) => ({
      ...prevCost,
      [name]: value <= 1 ? 1 : parseInt(value),
    }));
  };

  //add useEffect watcher to reset both cost.pages & cost.languages when deselect cost.website
  useEffect(() => {
    !cost.website &&
      (cost.pages > 1 || cost.languages > 1) &&
      setCost({ ...cost, pages: 1, languages: 1 });
  }, [cost]);

  return (
    <div className="App">
      <h3> Which services do you require?</h3>
      <p>
        <input
          className="checkbox"
          type="checkbox"
          name="website"
          onChange={handleOnChange}
          value="500"
        />
        A website (500 €)
      </p>
      {isWebChecked && (
        <Panel
          // update the cost.pages & cost.languages state whenever the input value change with this
          functionPages={(e) => setCost({ ...cost, pages: e.target.value })}
          functionLang={(e) => setCost({ ...cost, languages: e.target.value })}
          functionIncPages={eventHandler}
          functionDecLang={eventHandler}
          functionIncLang={eventHandler}
          functionDecPages={eventHandler}
          pages={cost.pages}
          languages={cost.languages}
        ></Panel>
      )}
      <p>
        <input
          type="checkbox"
          name="seo"
          onChange={handleOnChange}
          value="300"
        />
        A SEO consultancy (300 €)
      </p>
      <p>
        <input
          type="checkbox"
          name="google"
          onChange={handleOnChange}
          value="200"
        />
        A Google Ads Campaign (200 €)
      </p>
      <p>
        <strong>Total price: {total} €</strong>
      </p>
    </div>
  );
}

export default App;
