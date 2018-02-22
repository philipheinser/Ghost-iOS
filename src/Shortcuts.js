export default [
  {
    name: 'bold',
    icon: 'bold',
    type: 'annotateWords',
    prefix: '**',
    suffix: '**',
  },
  {
    name: 'italic',
    icon: 'italic',
    type: 'annotateWords',
    prefix: '*',
    suffix: '*',
  },
  {
    name: 'header',
    icon: 'header',
    type: 'annotateLine',
    prefix: '#',
    maxStack: 3,
  },
  {
    name: 'quote',
    icon: 'quote-left',
    type: 'annotateLine',
    prefix: '>',
    maxStack: 1,
  },
  {
    name: 'ul',
    icon: 'list-ul',
    type: 'annotateLine',
    prefix: '*',
    maxStack: 1,
  },
  {
    name: 'ol',
    icon: 'list-ol',
    type: 'annotateLine',
    maxStack: 1,
  },
  {
    name: 'link',
    icon: 'link',
    type: 'annotateWords',
    prefix: '[',
    suffix: '](https://)',
  },
  {
    name: 'picture',
    icon: 'picture-o',
  },
  {
    name: 'unsplash',
    icon: 'camera',
  },
  {
    name: 'preview',
    icon: 'eye',
  },
  {
    name: 'help',
    icon: 'question-circle',
  },
];
