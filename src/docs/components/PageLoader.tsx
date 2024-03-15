import React from 'react';
import MarkdownPage from './MarkdownPage';
import Changelog from './Changelog';

const categorySubcategoryMap = {
  'getting-started': ['first-steps', 'terminology'],
  'stage': ['usage', 'react', 'angular', 'event-listeners', 'async-stages'],
  'sprites': ['usage', 'properties', 'details', 'parenting', 'the-base-shape-class', 'event-listeners', 'strokeablesprite', 'line', 'rect', 'ellipse', 'beziercurve', 'path', 'polygon', 'star', 'text', 'label', 'image', 'nullsprite'],
  'animation': ['channels', 'smart-animations', 'distribute', 'easing'],
  'types': [], // No subcategories for 'types'
  'utils': ['animation'],
  'changelog': [] // No subcategories for 'changelog'
};

const isValidSubcategory = (category: string, subcategory: string) => {
  return categorySubcategoryMap[category] && categorySubcategoryMap[category].includes(subcategory);
};

const PageLoader = ({category, subcategory }: {category: string, subcategory: string}) => {
  const isValidCategory = categorySubcategoryMap[category] !== undefined;
  const isValidSubcat = isValidCategory && isValidSubcategory(category, subcategory);

  const path = isValidSubcat ? `/markdown/${category}/${subcategory}.md` : `/markdown/${category}/main.md`;

  return category === 'changelog' ? <Changelog /> :
    <MarkdownPage path={path} />;
};

export default PageLoader;

