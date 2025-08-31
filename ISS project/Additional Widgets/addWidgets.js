//CSV Table Code

function demoB () {
  // (PART A) READ CSV FILE
  Papa.parse(document.getElementById("picker").files[0], {
    skipEmptyLines: true,

    // (PART B) DRAW CSV FILE
    complete : csv => {
      // (B1) GET + RESET HTML TABLE
      var table = document.getElementById("demoB");
          table.innerHTML = "";

      // (B2) DRAW TABLE ROWS
      for (let row of csv.data) {
        let tr = table.insertRow();
        for (let cell of row) {
          let td = tr.insertCell();
          td.innerHTML = cell;
        }
      }
    }
  });
}