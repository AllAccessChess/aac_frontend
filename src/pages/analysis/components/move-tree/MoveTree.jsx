import React from "react";

import {
  MoveListCell,
  MoveListIndex,
  MoveListRow,
  SubTree,
  SubTreeCell,
  SubTreeMain,
  SubTreeMainIndex,
  SubTreeWrapper,
  Wrapper,
} from "./styles";

export const MoveTree = (props) => {
  const { moveTree, currentMoveId, onShowPast } = props;

  const renderSubTree = (tree, currentId) => {
    const elements = [];
    let currentTree = tree;

    let subElements = [];

    while (1) {
      if (!currentTree) {
        break;
      }
      const currentTreeId = currentTree.id;

      if (currentTree.level % 2 === 1 || !subElements.length) {
        subElements.push(
          <SubTreeMainIndex
            key={`subtree-${currentTree.id}-index`}
            className={`subtree-${currentTree.id}-index`}
          >
            {currentTree.level % 2 === 1
              ? `${(currentTree.level + 1) / 2}.`
              : `${currentTree.level / 2}...`}
          </SubTreeMainIndex>
        );
      }

      subElements.push(
        <SubTreeCell
          className={currentId === currentTree.id ? "active" : ""}
          even={(currentTree.level % 2 === 0).toString()}
          key={currentTree.id}
          onClick={() => onShowPast(currentTreeId)}
        >
          {currentTree.move.san}
        </SubTreeCell>
      );

      if (!currentTree.children.length || currentTree.children.length > 1) {
        break;
      }

      currentTree = currentTree.children[0];
    }

    elements.push(
      <SubTreeMain
        key={`subtree-${tree.id}-main`}
        className={`subtree-${tree.id}-main`}
      >
        {subElements}
      </SubTreeMain>
    );

    if (currentTree.children.length) {
      elements.push(
        <SubTreeWrapper
          key={`subtree-${tree.id}-subtree`}
          className={`subtree-${tree.id}-subtree`}
        >
          {currentTree.children.map((subTree) => (
            <SubTree
              key={`subtree-${tree.id}-subtree-${subTree.id}`}
              className={`subtree-${tree.id}-subtree-${subTree.id}`}
            >
              {renderSubTree(subTree, currentId)}
            </SubTree>
          ))}
        </SubTreeWrapper>
      );
    }

    return elements;
  };

  const renderMoveTree = (tree, currentId, subTrees = []) => {
    const elements = [];
    if (tree.level % 2 === 1) {
      let subElements = [];

      subElements.push(
        <MoveListIndex
          key={`level-${tree.level}-1-index`}
          className={`level-${tree.level}-1-index`}
        >
          {(tree.level + 1) / 2}
        </MoveListIndex>
      );
      subElements.push(
        <MoveListCell
          key={tree.id}
          className={tree.id === currentId ? "active" : ""}
          onClick={() => onShowPast(tree.id)}
        >
          <span>{tree.move.san}</span>
          <span>{!!tree.score ? tree.score : ""}</span>
        </MoveListCell>
      );

      if (subTrees.length) {
        subElements.push(
          <MoveListCell
            key={`level-${tree.level}-1-ex`}
            className={`level-${tree.level}-1-ex`}
          >
            <span>...</span>
            <span></span>
          </MoveListCell>
        );
        elements.push(
          <MoveListRow
            key={`level-${tree.level}-1`}
            className={`level-${tree.level}-1`}
          >
            {subElements}
          </MoveListRow>
        );

        elements.push(
          <SubTreeWrapper
            key={`level-${tree.level}-1-subtree`}
            className={`level-${tree.level}-1-subtree`}
            root="true"
          >
            {subTrees.map((subTree) => (
              <SubTree
                key={`level-${tree.level}-1-subtree-${subTree.id}`}
                className={`level-${tree.level}-1-subtree-${subTree.id}`}
              >
                {renderSubTree(subTree, currentId)}
              </SubTree>
            ))}
          </SubTreeWrapper>
        );

        subElements = [];
        subElements.push(
          <MoveListIndex
            key={`level-${tree.level}-2-index`}
            className={`level-${tree.level}-2-index`}
          >
            {(tree.level + 1) / 2}
          </MoveListIndex>
        );
        subElements.push(
          <MoveListCell
            key={`level-${tree.level}-ex`}
            className={`level-${tree.level}-ex`}
          >
            <span>...</span>
            <span></span>
          </MoveListCell>
        );
      }

      if (tree.children.length) {
        const firstSubTree = tree.children[0];
        subElements.push(
          <MoveListCell
            key={firstSubTree.id}
            className={firstSubTree.id === currentId ? "active" : ""}
            onClick={() => onShowPast(firstSubTree.id)}
          >
            <span>{firstSubTree.move.san}</span>
            <span>{!!firstSubTree.score ? firstSubTree.score : ""}</span>
          </MoveListCell>
        );

        elements.push(
          <MoveListRow
            key={`level-${tree.level}`}
            className={`level-${tree.level}`}
          >
            {subElements}
          </MoveListRow>
        );

        if (tree.children.length > 1) {
          elements.push(
            <SubTreeWrapper
              key={`level-${tree.level}-subtree`}
              className={`level-${tree.level}-subtree`}
              root="true"
            >
              {tree.children.slice(1).map((subTree) => (
                <SubTree
                  key={`level-${tree.level}-subtree-${subTree.id}`}
                  className={`level-${tree.level}-subtree-${subTree.id}`}
                >
                  {renderSubTree(subTree, currentId)}
                </SubTree>
              ))}
            </SubTreeWrapper>
          );
        }

        elements.push(...renderMoveTree(firstSubTree, currentId));
      } else {
        elements.push(
          <MoveListRow
            key={`level-${tree.level}-1`}
            className={`level-${tree.level}-1`}
          >
            {subElements}
          </MoveListRow>
        );
      }
    } else {
      if (tree.children.length) {
        elements.push(
          ...renderMoveTree(tree.children[0], currentId, tree.children.slice(1))
        );
      }
    }
    return elements;
  };

  return (
    <Wrapper>
      {moveTree ? renderMoveTree(moveTree, currentMoveId) : null}
    </Wrapper>
  );
};
