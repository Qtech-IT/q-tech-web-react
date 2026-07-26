import { Button } from "./Button";
import { Link, router } from '@inertiajs/react';

const LinkButton = ({ link, text }: { link: string; text: string }) => {

  return (
    <Button onClick={()=> router.visit(link)} variant="outline" className="w-full justify-start">
        {text}
    </Button>
  );
};

export default LinkButton;
