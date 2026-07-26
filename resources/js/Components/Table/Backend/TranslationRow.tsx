
import { TableCell, TableRow } from '@/Components/UI/Table';
import { Textarea } from '@/Components/UI/Textarea';

const TranslationRow = ({
  translationKey,
  value,
  index,
  onChange
}: any) => {
  return (
    <TableRow className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
      <TableCell className="px-6 py-4 ">#{index + 1}</TableCell>
      <TableCell className="px-6 py-4  text-sm">{translationKey}</TableCell>
      <TableCell className="px-6 py-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(translationKey, e.target.value)}
          className="min-h-[80px] resize-none"
          placeholder="Enter translation..."

        />
      </TableCell>
    </TableRow>
  );
};

export default TranslationRow;

