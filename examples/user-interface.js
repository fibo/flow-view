import { FlowView } from 'flow-view';

const container = document.querySelector('.container');
if (!container)
  throw new Error('Container element not found');
const flowView = FlowView.instance(container);

const parents = ['Marge', 'Homer', 'Ned'];
const children = ['Bart', 'Lisa', 'Milhouse', 'Ralph'];

/** @param {string} text */
flowView.nodeTextToType = (text) => {
	if (parents.includes(text)) return 'parent';
	if (children.includes(text)) return 'child';
}

flowView.nodeTypeSignature
	.set('child', { ins: [{ name: 'in1' }, { name: 'in2' }] })
	.set('parent', { outs: [{ name: 'out' }] });

const nodeList = [
    'Marge',
    'Homer',
    'Bart',
    'Lisa',
    'Barney',
    'Milhouse',
    'Moe',
    'Ned',
    'Patty',
    'Ralph',
    'Selma',
    'Mr. Burns',
];
nodeList.forEach(item => flowView.nodeList.add(item))

const initialGraph = {
  nodes: [
    {
      id: 'dad',
      text: 'Homer',
      x: 60,
      y: 70,
      outs: [{ id: 'children', name: 'out' }]
    },
    {
      id: 'mom',
      text: 'Marge',
      x: 160,
      y: 70,
      outs: [{ id: 'children', name: 'out' }]
    },
    {
      id: 'son',
      text: 'Bart',
      x: 60,
      y: 240,
      ins: [
        { id: 'father', name: 'in1' },
        { id: 'mother', name: 'in2' }
      ]
    },
    {
      id: 'daughter',
      text: 'Lisa',
      x: 220,
      y: 220,
      ins: [
        { id: 'father', name: 'in1' },
        { id: 'mother', name: 'in2' }
      ]
    }
  ],
  edges: [
    { from: ['dad', 'children'], to: ['son', 'father'] },
    { from: ['dad', 'children'], to: ['daughter', 'father'] },
    { from: ['mom', 'children'], to: ['son', 'mother'] },
    { from: ['mom', 'children'], to: ['daughter', 'mother'] }
  ]
}

flowView.load(initialGraph);
