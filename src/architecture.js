import jsyaml from "js-yaml";



function architecture() {
  const text = architecture_text();
  const yamlStructure =  jsyaml.load(text);

  const nodesList = yamlStructure.map((node,i) => {
    return {
      name: node.name,
      type: node.type,
      index:i
    }
  });
  const edgesList = yamlStructure.map((node) => {
    if (node.uses) {
      return node.uses.map((use) => {
        return {
          source: node.name,
          target: use.name,
          type: use.type,
          name: use.edge_text
        }
      })
    }
  }
  ).flat().filter((x) => x !== undefined);

  const nodeDictionary = Object.fromEntries(yamlStructure.map((node,i) => [node.name,i]));
  const edgesListNumeric = edgesList.map((edge) => {
    return {
      source: nodeDictionary[edge.source],
      target: nodeDictionary[edge.target],
      type: edge.type,
      name: edge.name
    }
  });

  // check if all source and target nodes are defined
  edgesListNumeric.forEach((edge) => {
    if (edge.source === undefined) {
      throw new Error("Source node " + edge.source + " is not defined. Target is " + edge.target + ".");
    }
    if (edge.target === undefined) {
      throw new Error("Target node " + edge.target + " is not defined. Source is " + nodesList[edge.source].name + ".");
    }
  });



  return { nodes: nodesList, links: edgesListNumeric };

}

function architecture_text() {

return `
---
- name: DatabaseAPI
  type: interface
  uses:
  - name: DatabaseSchema
- name: DatabaseSchema
  type: document

- name: DatabaseAdapter
  uses:
  - name: DatabaseAPI
    type: solid

- name: ApplicationServer
  uses:
  - name: DatabaseAPI
    type: dashed
    edge_text: use
`;
}

export default architecture;