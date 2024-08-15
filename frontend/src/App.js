import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Grid from "./components/Grid";

const App = () => {
  const [user1Grid, setUser1Grid] = useState(
    Array(3).fill(Array(3).fill(null))
  );
  const [user2Grid, setUser2Grid] = useState(
    Array(3).fill(Array(3).fill(null))
  );
  const [isUser1GridComplete, setIsUser1GridComplete] = useState(false);
  const [isUser2GridComplete, setIsUser2GridComplete] = useState(false);
  const [winner, setWinner] = useState(null);
  const intervalRef = useRef(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [crossedNumbers, setCrossedNumbers] = useState([]);

  useEffect(() => {
    if (isUser1GridComplete && isUser2GridComplete) {
      handleGridComplete().then(()=> {})
    }
  }, [user1Grid, isUser1GridComplete, user2Grid, isUser2GridComplete]);

  useEffect(() => {
    const fetchGrids = async () => {
      const res = await axios.get("http://localhost:4000/api/grids/grids");
      if(res.data.message === "no grids found" ){
        return null;
      }
      const { grids } = res.data;
      const { grid1, grid2 } = grids;
      // Convert string values to integers
      const parsedGrid1 = grid1.map((row) =>
        row.map((value) => parseInt(value))
      );
      const parsedGrid2 = grid2.map((row) =>
        row.map((value) => (value !== null ? parseInt(value) : null))
      );
      setCrossedNumbers(grids.crossNumber);
      setUser1Grid(parsedGrid1);
      setUser2Grid(parsedGrid2);
      setIsUser1GridComplete(true);
      setIsUser2GridComplete(true);
      // console.log(res.data);
    };

    fetchGrids();
  }, []);

  // const fetchGrids = async () => {
  //   try {
  //     const res1 = await axios.get("http://localhost:4000/api/grids/user1");
  //     const res2 = await axios.get("http://localhost:4000/api/grids/user2");
  //     setUser1Grid(res1.data.grid);
  //     setUser2Grid(res2.data.grid);
  //   } catch (error) {
  //     console.error("Failed to fetch grids", error);
  //   }
  // };

  const handleGridComplete = async () => {
    try {
      // const grid = user === 'user1' ? user1Grid : user2Grid;
      await axios.post("http://localhost:4000/api/grids/create", {
        user1Grid,
        user2Grid,
      });

      if (isUser1GridComplete && isUser2GridComplete) {
        setIsGameStarted(true);
      }
    } catch (error) {
      console.error("Failed to submit grid", error);
    }
  };

  const startNumberDrawing = () => {
    const drawNumber = () => {
      const drawnNumber = Math.floor(Math.random() * 9) + 1;
      handleNumberDraw(drawnNumber);
    };

    // if(!winner){

    intervalRef.current = setInterval(drawNumber, 2000);
  };
  useEffect(() => {
    if (winner && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // Clear the reference to avoid memory leaks
    }
  }, [winner]);
  const stopGame = () => {
    setIsGameStarted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("Game stopped manually.");
    }
  };

  const isCrossed = (number) => crossedNumbers.includes(Number(number));

  const handleNumberDraw = async (number) => {
    try {
      if (!winner) {
        const res = await axios.put("http://localhost:4000/api/grids/mark", {
          number: number,
        });
        setCrossedNumbers((prev) => [...prev, number]);

        if (res.data.message === "User1 wins!") {
          setWinner("User1");
        }
        if (res.data.message === "User2 wins!") {
          setWinner("User2");
        }
        // await fetchGrids();
      }
    } catch (error) {
      console.error("Failed to draw number", error);
    }
  };

  const checkForWinner = (grid, user) => {
    const isRowComplete = grid.some((row) => row.every((num) => num === "X"));
    const isColComplete = grid[0].some((_, colIndex) =>
      grid.every((row) => row[colIndex] === "X")
    );

    if (isRowComplete || isColComplete) {
      setWinner(user);
    }
  };

  useEffect(() => {
    if (isGameStarted) {
      startNumberDrawing();
    }
  }, [isGameStarted]);

  return (
    <div>
      <h1>Lottery Game</h1>

      {!isGameStarted && (
        <>
          <div>
            <h2>User 1's Grid</h2>

            <Grid
              grid={user1Grid}
              setGrid={setUser1Grid}
              onGridComplete={() => {
                setIsUser1GridComplete(true);
                
              }}
            />
          </div>

          <div>
            <h2>User 2's Grid</h2>

            <Grid
              grid={user2Grid}
              setGrid={setUser2Grid}
              onGridComplete={() => {
                setIsUser2GridComplete(true);
                
              }}
            />
          </div>
        </>
      )}
      {isGameStarted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* User1's Grid */}
          <div>
            <h3>User1's Grid</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 50px)",
                gap: "5px",
              }}
            >
              {user1Grid.flat().map((cell, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid black",
                    backgroundColor: isCrossed(cell) ? "lightcoral" : "white",
                    position: "relative",
                  }}
                >
                  {isCrossed(cell) && (
                    <div
                      style={{
                        position: "absolute",
                        color: "red",
                        fontSize: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      &#10060;
                    </div>
                  )}
                  {cell}
                </div>
              ))}
            </div>
          </div>

          {/* User2's Grid */}
          <div>
            <h3>User2's Grid</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 50px)",
                gap: "5px",
              }}
            >
              {user2Grid.flat().map((cell, idx) => (
                <div
                  key={idx}
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid black",
                    backgroundColor: isCrossed(cell) ? "lightcoral" : "white",
                    position: "relative",
                  }}
                >
                  {isCrossed(cell) && (
                    <div
                      style={{
                        position: "absolute",
                        color: "red",
                        fontSize: "30px",
                        fontWeight: "bold",
                      }}
                    >
                      &#10060;
                    </div>
                  )}
                  {cell}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isUser1GridComplete && isUser2GridComplete && !isGameStarted && (
        <button onClick={() => setIsGameStarted(true)}>Start Game</button>
      )}
      {isGameStarted && <button onClick={() => stopGame()}>Stop Game</button>}
      {winner && <h3>{winner} wins!</h3>}
    </div>
  );
};

export default App;
