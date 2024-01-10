import { Button } from "@/components/ui/button"
import { useState } from "react"

import "./styles.css"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="bg-background h-[250px] w-[250px]">
      <h2 className="text-2xl">
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Satty
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://youtube.com/" target="_blank">
        <Button>View Youtube</Button>
      </a>
    </div>
  )
}

export default IndexPopup
