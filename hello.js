var { JSDOM } = require('jsdom')

main()

async function main() {
	// const html = await (await fetch("https://www.queensu.ca/academic-calendar/arts-science/course-descriptions/phys/")).text()
	// const dom =new jsdom.JSDOM(html)
	JSDOM.fromURL("https://www.queensu.ca/academic-calendar/arts-science/course-descriptions/phys/").then(dom => {
		const { window } = dom
		const { document } = window
		const list = Array.from(document.querySelectorAll(".courseblock"))
		const arr = list.map(course => remove_empty(Array.from(course.children).map(html => html.textContent.trim())))

		/*
			subject
			code
			units
			title
			description
			learning hours
			requirements
			note
			faculty
		 */
		const objs = []
		for (const entry of arr)
		{
			const obj = {}
			obj.subject = entry[0].substring(0, 4)
			obj.code = entry[0].substring(5, 8)
			obj.units = entry[0].substring(entry[0].length-4)
			obj.title = entry[0].substring(8, entry[0].indexOf("Units")).trim()

			let first_n = entry[1].indexOf("\n")
			obj.description = entry[1].substring(0, first_n != -1 ? first_n : entry[1].length)

			if(first_n != -1) {
				const a = entry[1].split("\n")
				obj.notes = a[1]
			}

			for (const el of entry)
			{
				if(el.includes("Requirements")) {
					obj.requirements = el
				}
				if(el.includes("Learning Hours")) {
					obj.learning_hours = el
				}
				if(el.includes("Offering Faculty"))
				{
					obj.faculty = el
				}
			}
			objs.push(obj)
		}
		console.log(objs)

		// const map = new Map()
		// arr.forEach(el => map.set(el[0].substring(5,8), el))
		// console.log(map)
		// window.close()
	})
	// const doc = dom.window.document
	// // const p = Array.from(doc.querySelectorAll(".courseblock")).map(block => block.innerText).map(txt => txt.split("\n"))
	// const p = doc.querySelectorAll(".courseblock")

	// console.log(p)
}

function remove_empty(arr) {
	return arr.filter(el => el)
}