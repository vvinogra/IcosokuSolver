class AvailableEdge {
    constructor(fValue, sValue, tValue) {
        this.value = [fValue, sValue, tValue]
        this.isUsed = false
    }

    toString() {
        return `[${this.value}]`
    }
}

class EdgeIcosaedro {
    constructor(fName, sName, tName) {
        this.fName = fName;
        this.sName = sName;
        this.tName = tName;
        this.value = null
    }

    toString() {
        return `(${this.fName},${this.sName},${this.tName})`
    }

    getFullCornerName() {
        return this.fName + this.sName + this.tName
    }
}


CONFIG = {
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8,
    'I': 9,
    'J': 10,
    'K': 11,
    'L': 12
}

VERTEX_MAP = {
    'A': CONFIG['A'],
    'B': CONFIG['B'],
    'C': CONFIG['C'],
    'D': CONFIG['D'],
    'E': CONFIG['E'],
    'F': CONFIG['F'],
    'G': CONFIG['G'],
    'H': CONFIG['H'],
    'I': CONFIG['I'],
    'J': CONFIG['J'],
    'K': CONFIG['K'],
    'L': CONFIG['L']
}

ICOSAEDRO_EDGES = [
    new EdgeIcosaedro('B', 'A', 'C'),  // BAC
    new EdgeIcosaedro('C', 'A', 'D'),  // CAD
    new EdgeIcosaedro('D', 'A', 'E'),  // DAE
    new EdgeIcosaedro('E', 'A', 'F'),  // EAF
    new EdgeIcosaedro('F', 'A', 'B'),  // FAB

    new EdgeIcosaedro('F', 'G', 'B'),  // FGB
    new EdgeIcosaedro('G', 'B', 'H'),  // GBH
    new EdgeIcosaedro('B', 'H', 'C'),  // BHC
    new EdgeIcosaedro('H', 'C', 'I'),  // HCI
    new EdgeIcosaedro('C', 'I', 'D'),  // CID

    new EdgeIcosaedro('I', 'D', 'J'),  // IDJ
    new EdgeIcosaedro('D', 'J', 'E'),  // DJE
    new EdgeIcosaedro('J', 'E', 'K'),  // JEK
    new EdgeIcosaedro('E', 'K', 'F'),  // EKF
    new EdgeIcosaedro('K', 'F', 'G'),  // KFG

    new EdgeIcosaedro('K', 'L', 'G'),  // KLG
    new EdgeIcosaedro('G', 'L', 'H'),  // GLH
    new EdgeIcosaedro('H', 'L', 'I'),  // HLI
    new EdgeIcosaedro('I', 'L', 'J'),  // ILJ
    new EdgeIcosaedro('J', 'L', 'K'),  // JLK
]

UPSIDE_DOWN_ICOSAEDRO_FACES = [
    "FGB",
    "BHC",
    "CID",
    "DJE",
    "EKF",
    "KLG",
    "GLH",
    "HLI",
    "ILJ",
    "JLK"
]

AVAILABLE_EDGES = [
    new AvailableEdge(0, 0, 0),
    new AvailableEdge(0, 0, 1),
    new AvailableEdge(0, 0, 2),
    new AvailableEdge(0, 0, 3),
    new AvailableEdge(0, 1, 1),
    new AvailableEdge(0, 1, 2), new AvailableEdge(0, 1, 2), new AvailableEdge(0, 1, 2),  // 5, 6, 7
    new AvailableEdge(0, 2, 1), new AvailableEdge(0, 2, 1), new AvailableEdge(0, 2, 1),  // 8, 9, 10
    new AvailableEdge(0, 2, 2),
    new AvailableEdge(0, 3, 3),
    new AvailableEdge(1, 1, 1),
    new AvailableEdge(1, 2, 3), new AvailableEdge(1, 2, 3),  // 14, 15
    new AvailableEdge(3, 2, 1), new AvailableEdge(3, 2, 1),  // 16, 17
    new AvailableEdge(2, 2, 2),
    new AvailableEdge(3, 3, 3)
]

function is_rotatable(availableEdge) {
    return !(availableEdge[0] === availableEdge[1] &&
        availableEdge[1] === availableEdge[2]);
}

function getNextIcosaedroEdge(vertexMap, icosaedroEdges) {
    let icosaedroEdgeToReturn = null
    let minScore = 999

    for (let icosaedroEdge of icosaedroEdges) {
        if (icosaedroEdge.value !== null) {
            continue
        }

        let score = vertexMap[icosaedroEdge.fName] +
            vertexMap[icosaedroEdge.sName] +
            vertexMap[icosaedroEdge.tName]

        if (score < minScore) {
            icosaedroEdgeToReturn = icosaedroEdge
            minScore = score
        }
    }

    return icosaedroEdgeToReturn
}

function startRec(edgeNum) {
    if (edgeNum === AVAILABLE_EDGES.length) {
        return true
    }

    let icosaedroEdge = getNextIcosaedroEdge(VERTEX_MAP, ICOSAEDRO_EDGES)

    for (let availableEdgeIndex = 0; availableEdgeIndex < AVAILABLE_EDGES.length; availableEdgeIndex++) {
        let availableEdge = AVAILABLE_EDGES[availableEdgeIndex]

        if (availableEdge.isUsed) {
            continue
        }

        let rotationsCount = is_rotatable(availableEdge.value) ? 3 : 1

        let rotationIndices = UPSIDE_DOWN_ICOSAEDRO_FACES.includes(icosaedroEdge.getFullCornerName()) ?
            [2, 1, 0] : [0, 1, 2]

        for (let side = 0; side < rotationsCount; side++) {
            let edgeF = availableEdge.value[(side + rotationIndices[0]) % 3]
            let edgeS = availableEdge.value[(side + rotationIndices[1]) % 3]
            let edgeT = availableEdge.value[(side + rotationIndices[2]) % 3]

            if (VERTEX_MAP[icosaedroEdge.fName] >= edgeF &&
                VERTEX_MAP[icosaedroEdge.sName] >= edgeS &&
                VERTEX_MAP[icosaedroEdge.tName] >= edgeT) {

                VERTEX_MAP[icosaedroEdge.fName] -= edgeF
                VERTEX_MAP[icosaedroEdge.sName] -= edgeS
                VERTEX_MAP[icosaedroEdge.tName] -= edgeT

                icosaedroEdge.value = [edgeF, edgeS, edgeT]
                availableEdge.isUsed = true

                if (startRec(edgeNum + 1))
                    return true

                availableEdge.isUsed = false
                icosaedroEdge.value = null

                VERTEX_MAP[icosaedroEdge.fName] += edgeF
                VERTEX_MAP[icosaedroEdge.sName] += edgeS
                VERTEX_MAP[icosaedroEdge.tName] += edgeT
            }
        }
    }

    return false
}

function main() {
    const mainLabel = "main"

    console.time(mainLabel);
    startRec(0)

    for (let icosaedroEdge of ICOSAEDRO_EDGES) {
        let faceText = `(${CONFIG[icosaedroEdge.fName]},${CONFIG[icosaedroEdge.sName]},${CONFIG[icosaedroEdge.tName]})`

        faceText += ` ${icosaedroEdge}`

        console.log(`Put tile [${icosaedroEdge.value}] on face ${faceText}`)
    }

    console.timeEnd(mainLabel)
}

main()
