export interface BaseCallbackInterface {
  callback: any;
  onSubmit?: (value: any) => void;
  disabled?: boolean;
}