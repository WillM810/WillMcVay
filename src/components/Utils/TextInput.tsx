type TextInputProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  placeholder?: string;
};

export default function TextInput(props: TextInputProps) {
  return (    
    <input
      type="text"
      className="w-[60%] mr-4 border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2"
      placeholder={props.placeholder}
      id={props.id}
      onChange={e => props.onChange(e)}
      onKeyDown={e => {
        if (e.key === 'Enter' && props.onEnter) {
          props.onEnter();
        }
      }}
      value={props.value}
    />
  );
}