async function getBase(query) {
  try {
    const response = await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("Token")}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    return await response.json();
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
}

let project = new Set()
let audit_proj_ratio = new Set()
let amount = []

getBase(`{
  user {
    transactions(
      where: {
        _and: [
          { object: { type: { _eq: "project" }, progresses: { isDone: { _eq: true } } } },
          { type: { _eq: "xp" } }
        ]
      }
      order_by: { createdAt: asc }
    ) {
      amount
      object {
        name
        progresses{
          grade
        }
      }
    }
  }
}
`).then(res => {



  res.data.user[0].transactions.map((e) => {
    audit_proj_ratio.add((e.object.progresses[0].grade - 1).toFixed(3))
  })

  //Graphique sur l'xp d'audit que le projet rapporte
  let arr_audit = Array.from(audit_proj_ratio.values())



  let name = document.getElementById("name")

  name.innerHTML += "Welcome " + localStorage.getItem("Username")

  let content = document.getElementById("content")
  let i = 0;

  content.style.display = "none"

  while (i < res.data.user[0].transactions.length) {
    let name_pro = res.data.user[0].transactions[i].object.name

    if (project.has(name_pro)) {
      i++
      continue
    }
    project.add(name_pro)

    amount.push(res.data.user[0].transactions[i].amount)
    i++
  }

  let projec_value = new Map()
  let nb_of_prog = 0;

  let projec_arr = Array.from(project)


  for (let j = 0; j < projec_arr.length; j++) {
    nb_of_prog++

    let amou_val = amount[j] / 1000

    if (projec_arr[j] == "groupie-tracker-visualizations") {
      continue
    }

    if (projec_arr[j] == "push-swap") {
      console.log(projec_arr[j], amount[j])
      projec_value.set(projec_arr[j], 18.375)
      continue
    }
    if (projec_arr[j] == "my-ls-1") {
      projec_value.set(projec_arr[j], 12.25)
      continue
    }


    if (amou_val == 3.4375) {
      projec_value.set(projec_arr[j], 34.375)
    } else {
      if (amou_val < 1) {
        projec_value.set(projec_arr[j], amount[j] / 100)
      } else {
        projec_value.set(projec_arr[j], amount[j] / 1000)
      }

      if (projec_arr[j] == projec_arr[projec_arr.length - 1]) {
        let div = document.createElement("div")
        div.className = "projects"
        div.innerHTML += projec_arr[j]
        content.appendChild(div)

      } else {
        let div = document.createElement("div")
        div.className = "projects"
        div.innerHTML += projec_arr[j]
        div.style.padding = 10 + "px" + 30 + "px"
        content.appendChild(div)
      }

    }

  }
  let index_rect = 0;
  let xp_amount = 0;
  let xp_stat = document.getElementById("amount-rect")
  let total_xp = document.getElementById("total_xp")
  let completed_projects = document.getElementById("completed-projects")

  let v_of_proj = Array.from(projec_value.values())
  let n_of_proj = Array.from(projec_value.keys())

  for (const amount of v_of_proj) {
    index_rect++
    let rect = document.createElement("div")
    rect.id = "rect " + index_rect

    rect.style.height = "10px";
    rect.style.width = "2.5rem";


    if (amount == 1) {
      rect.style.height = 10 + 5 + "px"

      rect.style.backgroundColor = "#091d3d"
      xp_stat.appendChild(rect)
    } else {
      if (amount == 24500) {
        xp_amount += amount
        continue
      }
      if (amount == 12250) {
        continue
      }
      rect.style.height = amount + 5 + "px"
      rect.style.width = 4.5 + "rem";
      rect.style.backgroundColor = "#091d3d"
      rect.style.borderRadius = 5 + "px"
      xp_stat.appendChild(rect)
      xp_amount += amount
    }
  }

  index_rect = 1;
  let projec_name = document.getElementById("project_name")

  n_of_proj.map(e => {
    let r = document.getElementById("rect " + index_rect)

    r.addEventListener("mouseover", function () {
      projec_name.innerHTML = e
      // content.style.display = "flex"
      // content.innerHTML += e
      r.style.backgroundColor = "#ea38fb"
    })
    r.addEventListener("mouseout", function () {
      projec_name.innerHTML = ""
      content.style.display = "none"
      r.style.backgroundColor = "blue"
    })
    index_rect++
  })

  xp_amount += 12.225 // Montant de groupie-tracker-visualisation (BUG du JSON)
  console.log("Xp amount:", xp_amount)
  total_xp.innerHTML += xp_amount.toFixed(1) + "kB"
  total_xp.style.color = "#ffef5e"

  completed_projects.innerHTML += nb_of_prog
  let audit_graph = document.getElementById("audit-graphic")
  let audit_container = document.getElementById("audit-container")



  let d1 = document.getElementById("d1")
  let d2 = document.getElementById("d2")
  let ifClick = false

  xp_stat.style.display = "none"
  audit_graph.style.display = "none"


let p_comp = document.getElementById("completed-projects")

p_comp.style.display = "none"
  d1.addEventListener("click", () => {
    if(getComputedStyle(xp_stat).display != "none"){
      p_comp.style.display = "none"
      xp_stat.style.display = "none";
    } else {
      p_comp.style.display = "flex"

      xp_stat.style.display = "flex";
    }
  })
  
  function togg(){
    if(getComputedStyle(audit_graph).display != "none"){
      audit_graph.style.display = "none";
      p_comp.style.display = "none"

    } else {
      if (!ifClick) {
        p_comp.style.display = "flex"
        ifClick = true
  arr_audit.map(e => {
        let audit_rect = document.createElement("div")
        audit_rect.style.height = e * 2  + "rem"
        audit_rect.style.width = 4.5 + "rem";
        audit_rect.style.paddingRight = 1 + "px"
        audit_rect.style.backgroundColor = "yellow"
      audit_rect.style.borderRadius = 5 + "px"
        
        audit_graph.appendChild(audit_rect)
      })

      }
      p_comp.style.display = "flex"
    audit_graph.style.display = "flex";
    }
  };

  d2.onclick = togg;
})



let but = document.getElementById("disconnect")

but.addEventListener(("click"), function () {
  localStorage.removeItem("Token")
  location.href = "../index.html"
})