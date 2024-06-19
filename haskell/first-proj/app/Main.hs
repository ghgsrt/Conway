module Main (main) where

import Lib

deez :: String -> String
deez x = x ++ " deez nuts"

main :: IO ()
main = minteract deez
