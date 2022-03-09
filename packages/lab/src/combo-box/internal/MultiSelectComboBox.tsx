import { useEffect, useMemo, useRef } from "react";
import { useAriaAnnouncer } from "@brandname/core";
import { useMultiSelectComboBox } from "./useMultiSelectComboBox";
import { getAnnouncement } from "./getAnnouncement";
import { BaseComboBoxProps } from "./DefaultComboBox";
import { TokenizedInputBase, TokenizedInputProps } from "../../tokenized-input";
import { Popper, usePopperListAdapter } from "../../popper";
import { TooltipContext } from "../../tooltip";
import { ListBase, ListStateContext } from "../../list";
import { useForkRef } from "../../utils";

export type MultiSelectComboBoxProps<Item> = BaseComboBoxProps<
  Item,
  "multiple"
> &
  Pick<
    TokenizedInputProps<Item>,
    | "onFocus"
    | "onBlur"
    | "onInputFocus"
    | "onInputBlur"
    | "onInputChange"
    | "onInputSelect"
    | "stringToItem"
  > & {
    InputProps?: Partial<TokenizedInputProps<Item>>;
    initialSelectedItem?: Item[];
    multiSelect: true;
    delimiter?: string | string[];
  };

export function MultiSelectComboBox<Item>(
  props: MultiSelectComboBoxProps<Item>
) {
  const {
    ListItem,
    Tooltip,
    tooltipEnterDelay,
    tooltipLeaveDelay,
    tooltipPlacement,
    rootRef,
    listRef: listRefProp,
    rootWidth,
    listWidth,
    inputRef: inputRefProp,
    PopperProps,
    ...restProps
  } = props;

  const { announce } = useAriaAnnouncer({ debounce: 1000 });

  const expandButtonRef = useRef(null);
  const listRef = useRef(null);
  // Use callback ref as listRef could be null when it's closed
  const setListRef = useForkRef(listRef, listRefProp);

  const { inputRef, listContext, inputProps, listProps, inputHelpers } =
    useMultiSelectComboBox({
      ...restProps,
      expandButtonRef,
    });

  const { allowAnnouncement, disabled, value, ...restInputProps } = inputProps;
  const { isListOpen, itemCount, itemToString, source, ...restListProps } =
    listProps;

  const tooltipContext = useMemo(
    () => ({
      Tooltip,
      enterDelay: tooltipEnterDelay,
      leaveDelay: tooltipLeaveDelay,
      placement: tooltipPlacement,
    }),
    [Tooltip, tooltipEnterDelay, tooltipLeaveDelay, tooltipPlacement]
  );

  const firstItem = null;

  const allowAnnouncementRef = useRef(allowAnnouncement);
  useEffect(() => {
    allowAnnouncementRef.current = allowAnnouncement;
  }, [allowAnnouncement]);

  useEffect(() => {
    if (allowAnnouncementRef.current && value && firstItem) {
      announce(getAnnouncement(itemCount, firstItem));
    }
  }, [value, firstItem, itemCount, announce]);

  const [reference, floating, popperPosition, maxListHeight] =
    usePopperListAdapter(isListOpen);

  useEffect(() => {
    if (rootRef.current) {
      reference(rootRef.current);
    }
  }, [rootRef]);

  return (
    <>
      <TooltipContext.Provider value={tooltipContext}>
        <TokenizedInputBase
          disabled={disabled}
          expandButtonRef={expandButtonRef}
          inputRef={useForkRef(inputRef, inputRefProp)}
          value={value}
          helpers={inputHelpers}
          {...restInputProps}
        />
      </TooltipContext.Provider>
      {rootRef.current && (
        <Popper
          anchorEl={rootRef.current}
          open={isListOpen}
          placement={popperPosition}
          role={null as any}
          ref={floating}
          style={{
            maxHeight: maxListHeight ?? "",
          }}
          {...PopperProps}
        >
          <TooltipContext.Provider value={tooltipContext}>
            <ListStateContext.Provider value={listContext}>
              <ListBase
                {...{
                  ListItem,
                  disabled,
                  itemCount,
                  itemToString,
                  width: listWidth || rootWidth,
                  source,
                  ...restListProps,
                  listRef: setListRef,
                }}
                maxHeight={maxListHeight || listProps.maxHeight}
              />
            </ListStateContext.Provider>
          </TooltipContext.Provider>
        </Popper>
      )}
    </>
  );
}