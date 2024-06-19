module Lib ( someFunc, minteract ) where

someFunc :: IO ()
someFunc = putStrLn "someFunc"


minteract :: (String -> String) -> IO ()
minteract f = do
    input <- getLine
    putStrLn $ f input

twoSum :: [Int] -> Int -> (Int, Int)
twoSum nums target = map (\num -> ) nums
