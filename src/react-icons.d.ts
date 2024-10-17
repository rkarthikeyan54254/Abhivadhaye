declare module 'react-icons/fa' {
  export const FaFeather: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  // Add other specific icons as needed
}

declare module 'react-icons/*' {
  const icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default icon;
}
